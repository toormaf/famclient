import { AndroidFilled, AppleFilled } from '@ant-design/icons';
import { URLS } from './Urls';
import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { EmailPhoneInput, Icons } from '../components';

function LandingHeader(){
  return (
    <header className="px-6 py-4 flex items-center justify-between">
      <img src="/src/public/image/favicon.svg" alt="Famroot" className="h-10"/>
      <div className="flex items-center gap-8">
          <a className="flex items-center gap-1 cursor-pointer" target='blank' href={URLS.ANDROID_APP_LINK}>
              <AndroidFilled className='text-[#7CB342] '/>
              <span className='text-sm'>Android App</span>
          </a>
          <a className="flex items-center gap-1 cursor-pointer" target='blank' href={URLS.IOS_APP_LINK}>
              <AppleFilled className='text-[#99999A] text-lg'></AppleFilled>
              <span className='text-sm'>iOS App</span>
          </a>
      </div>
    </header>
  );
}

function LandingCarousel(){
  const [index, setIndex] = useState(0);
  return (
    <div className="w-full max-w-xl mx-auto overflow-hidden rounded-xl">
      <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${index * 100}%)` }}>
          <div className="w-full flex flex-col items-center flex-shrink-0">
            <img className='max-w-xl h-full' src="/src/public/image/Tree1.svg" />
            <span className="text-sm font-bold m-8">“ Family Tree is Heritage ”</span>
          </div>
          <div className="w-full flex flex-col items-center flex-shrink-0">
            <img className='max-w-xl h-full' src="/src/public/image/Tree2.svg" />
            <span className="text-sm font-bold m-8">“ Family Tree is History ”</span>
          </div>
          <div className="w-full flex flex-col items-center flex-shrink-0">
            <img className='max-w-xl h-full' src="/src/public/image/Tree3.svg" />
            <span className="text-sm font-bold m-8">“ Family Tree is Health ”</span>
          </div>
      </div>
      <div className="flex justify-center gap-5"> 
          <span className={(index ==0 ?"bg-primary":"bg-white")+" block w-3 h-3 shadow-xl cursor-pointer rounded-full"} onClick={()=>setIndex(0)}></span>
          <span className={(index ==1 ?"bg-primary":"bg-white")+" block w-3 h-3 shadow-xl cursor-pointer rounded-full"} onClick={()=>setIndex(1)}></span>
          <span className={(index ==2 ?"bg-primary":"bg-white")+" block w-3 h-3 shadow-xl cursor-pointer rounded-full"} onClick={()=>setIndex(2)}></span>
      </div>
    </div>    
  );
}

function Landing(show:any) {
  const [contactValue, setContactValue] = useState('');
  const [password, setPassword] = useState('');
  const [isContactValid, setIsContactValid] = useState(false);
  const [form] = Form.useForm();

  const handleLogin = () => {
    if (!isContactValid) {
      message.error('Please enter a valid email or phone number');
      return;
    }
    if (!password) {
      message.error('Please enter your password');
      return;
    }
    message.success('Login successful!');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader></LandingHeader>
      <main className="flex-1 flex items-center justify-center bg-[url('/src/public/image/BG.svg')] bg-cover bg-center bg-no-repeat">
        <LandingCarousel></LandingCarousel>
        <div className="w-[380px] flex flex-col items-center max-w-xl mx-auto shadow-lg bg-white rounded-lg p-8 box-border">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">LOGIN</h2>
          <Form form={form} layout="vertical" className="w-full" onFinish={handleLogin}>
            <Form.Item required className="mb-4">
              <EmailPhoneInput value={contactValue} onChange={setContactValue} onValidationChange={setIsContactValid}
                placeholder="Email or phone number"/>
            </Form.Item>

            <Form.Item required className="mb-6">
              <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} prefix={<Icons.KeyOutline className='text-grey'/>} size="middle"
                placeholder="Enter your password" />
            </Form.Item>

            <Form.Item className="mb-0 flex justify-center">
              <Button type="primary" htmlType="submit" size="middle">Login Now</Button>
            </Form.Item>
          </Form>
        </div>
      </main>

      <footer className="p-2 text-center text-gray-600 text-sm text-bold font-medium">
        <p>Famroot@2025</p>
      </footer>
    </div>
  );
}

export default Landing;
