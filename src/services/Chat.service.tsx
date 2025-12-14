import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Conversation {
  id: string;
  type: 'personal' | 'group' | 'public';
  name?: string;
  avatar_url?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  last_message?: {
    content: string;
    created_at: string;
    sender_id: string;
  };
  unread_count?: number;
  is_muted?: boolean;
  is_archived?: boolean;
  is_pinned?: boolean;
  participant_settings?: {
    is_muted: boolean;
    is_archived: boolean;
    is_pinned: boolean;
    last_read_at: string;
  };
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface ConversationParticipant {
  id: string;
  conversation_id: string;
  user_id: string;
  is_muted: boolean;
  is_archived: boolean;
  is_pinned: boolean;
  last_read_at: string;
  joined_at: string;
}

const ChatService = {
  async getConversations(type: 'personal' | 'group' | 'public', userId: string, showMuted: boolean = true) {
    try {
      const { data: participants, error: participantError } = await supabase
        .from('conversation_participants')
        .select('conversation_id, is_muted, is_archived, is_pinned, last_read_at')
        .eq('user_id', userId)
        .eq('is_archived', false);

      if (participantError) throw participantError;

      const conversationIds = participants?.map(p => p.conversation_id) || [];

      if (conversationIds.length === 0) {
        return [];
      }

      const { data: conversations, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .eq('type', type)
        .in('id', conversationIds)
        .order('updated_at', { ascending: false });

      if (convError) throw convError;

      const conversationsWithDetails = await Promise.all(
        (conversations || []).map(async (conv) => {
          const participant = participants?.find(p => p.conversation_id === conv.id);

          if (!showMuted && participant?.is_muted) {
            return null;
          }

          const { data: lastMessage } = await supabase
            .from('messages')
            .select('content, created_at, sender_id')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          const { count: unreadCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .gt('created_at', participant?.last_read_at || new Date(0).toISOString());

          return {
            ...conv,
            last_message: lastMessage || undefined,
            unread_count: unreadCount || 0,
            participant_settings: participant || undefined,
          };
        })
      );

      return conversationsWithDetails.filter(c => c !== null) as Conversation[];
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }
  },

  async searchConversations(query: string, userId: string) {
    try {
      const { data: participants, error: participantError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', userId);

      if (participantError) throw participantError;

      const conversationIds = participants?.map(p => p.conversation_id) || [];

      if (conversationIds.length === 0 || !query.trim()) {
        return [];
      }

      const { data: conversations, error } = await supabase
        .from('conversations')
        .select('*')
        .in('id', conversationIds)
        .ilike('name', `%${query}%`)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      return conversations as Conversation[];
    } catch (error) {
      console.error('Error searching conversations:', error);
      return [];
    }
  },

  async getMessages(conversationId: string) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return data as Message[];
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  },

  async sendMessage(conversationId: string, senderId: string, content: string) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: senderId,
          content,
        })
        .select()
        .single();

      if (error) throw error;

      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      return data as Message;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  },

  async markAsRead(conversationId: string, userId: string) {
    try {
      const { error } = await supabase
        .from('conversation_participants')
        .update({ last_read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .eq('user_id', userId);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error marking as read:', error);
      return false;
    }
  },

  async muteConversation(conversationId: string, userId: string, mute: boolean = true) {
    try {
      const { error } = await supabase
        .from('conversation_participants')
        .update({ is_muted: mute })
        .eq('conversation_id', conversationId)
        .eq('user_id', userId);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error muting conversation:', error);
      return false;
    }
  },

  async archiveConversation(conversationId: string, userId: string, archive: boolean = true) {
    try {
      const { error } = await supabase
        .from('conversation_participants')
        .update({ is_archived: archive })
        .eq('conversation_id', conversationId)
        .eq('user_id', userId);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error archiving conversation:', error);
      return false;
    }
  },

  async pinConversation(conversationId: string, userId: string, pin: boolean = true) {
    try {
      const { error } = await supabase
        .from('conversation_participants')
        .update({ is_pinned: pin })
        .eq('conversation_id', conversationId)
        .eq('user_id', userId);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error pinning conversation:', error);
      return false;
    }
  },

  async deleteConversation(conversationId: string, userId: string) {
    try {
      const { error } = await supabase
        .from('conversation_participants')
        .delete()
        .eq('conversation_id', conversationId)
        .eq('user_id', userId);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      return false;
    }
  },

  async createConversation(
    type: 'personal' | 'group' | 'public',
    name: string | undefined,
    createdBy: string,
    participantIds: string[]
  ) {
    try {
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .insert({
          type,
          name,
          created_by: createdBy,
        })
        .select()
        .single();

      if (convError) throw convError;

      const participantData = participantIds.map(userId => ({
        conversation_id: conversation.id,
        user_id: userId,
      }));

      const { error: participantError } = await supabase
        .from('conversation_participants')
        .insert(participantData);

      if (participantError) throw participantError;

      return conversation as Conversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      return null;
    }
  },

  async getConversationCounts(userId: string) {
    try {
      const { data: participants } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', userId)
        .eq('is_archived', false);

      const conversationIds = participants?.map(p => p.conversation_id) || [];

      if (conversationIds.length === 0) {
        return { personal: 0, group: 0, public: 0 };
      }

      const { data: conversations } = await supabase
        .from('conversations')
        .select('type')
        .in('id', conversationIds);

      const counts = {
        personal: 0,
        group: 0,
        public: 0,
      };

      conversations?.forEach(conv => {
        counts[conv.type as keyof typeof counts]++;
      });

      return counts;
    } catch (error) {
      console.error('Error getting conversation counts:', error);
      return { personal: 0, group: 0, public: 0 };
    }
  },
};

export default ChatService;
