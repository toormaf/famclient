/*
  # Add Message Features

  ## Overview
  Adds support for pinned messages, message reactions, and system messages.

  ## Changes
  
  ### 1. Update messages table
  - Add `is_pinned` column for pinned messages
  - Add `is_system_message` column for system notifications
  - Add `replied_to_message_id` for message replies
  - Add `message_type` for different types of messages

  ### 2. Create message_reactions table
  - Stores emoji reactions to messages
  - Links users to their reactions on specific messages

  ## Security
  - Maintain existing RLS policies
  - Add policies for reactions table
*/

-- Add new columns to messages table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'is_pinned'
  ) THEN
    ALTER TABLE messages ADD COLUMN is_pinned boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'is_system_message'
  ) THEN
    ALTER TABLE messages ADD COLUMN is_system_message boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'replied_to_message_id'
  ) THEN
    ALTER TABLE messages ADD COLUMN replied_to_message_id uuid REFERENCES messages(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'message_type'
  ) THEN
    ALTER TABLE messages ADD COLUMN message_type text DEFAULT 'text' CHECK (message_type IN ('text', 'system', 'image', 'file'));
  END IF;
END $$;

-- Create message_reactions table
CREATE TABLE IF NOT EXISTS message_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES messages(id) ON DELETE CASCADE NOT NULL,
  user_id uuid NOT NULL,
  reaction text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(message_id, user_id, reaction)
);

-- Enable RLS on message_reactions
ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for message_reactions
CREATE POLICY "Users can view reactions in their conversations"
  ON message_reactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM messages
      JOIN conversation_participants ON conversation_participants.conversation_id = messages.conversation_id
      WHERE messages.id = message_reactions.message_id
      AND conversation_participants.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add reactions to messages"
  ON message_reactions FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM messages
      JOIN conversation_participants ON conversation_participants.conversation_id = messages.conversation_id
      WHERE messages.id = message_reactions.message_id
      AND conversation_participants.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can remove their own reactions"
  ON message_reactions FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_message_reactions_message_id 
  ON message_reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_messages_replied_to 
  ON messages(replied_to_message_id);
CREATE INDEX IF NOT EXISTS idx_messages_pinned 
  ON messages(conversation_id, is_pinned) WHERE is_pinned = true;