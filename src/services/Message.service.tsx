import { message } from "antd";
import { ERROR_MESSAGE_TIMING } from "../constants/Constants";
import * as Aicon from '@ant-design/icons';

const MessageService = {
    oldErrorContent : "",
    error: (content:string, duration = ERROR_MESSAGE_TIMING)=>{
        message.error({key:content, type:'error', content: <div className="flexr-sb gap15">
            {content}
            <Aicon.CloseOutlined className="txt12" onClick={e => message.destroy()}/>
        </div>, duration: duration});
    },
    success: (content:string, duration = ERROR_MESSAGE_TIMING)=>{
        message.success({key:content, type:'error', content: <div className="flexr-sb gap15">
            {content}
            <Aicon.CloseOutlined className="txt12" onClick={e => message.destroy()}/>
        </div>, duration: duration});
    },
    setConfig: (config:any)=>{
        message.config(config);
    },
    destroy: ()=>{
        message.destroy();
    }
};
export default MessageService;