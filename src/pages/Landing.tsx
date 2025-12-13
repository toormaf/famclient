import { AndroidFilled, AppleFilled, ArrowLeftOutlined, UserOutlined } from '@ant-design/icons';
import { URLS } from './Urls';
import { useState } from 'react';
import { Form, Input, Button, message, Checkbox } from 'antd';
import { EmailPhoneInput, Icons } from '../components';
import { Link } from 'react-router-dom';

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

function Landing(props:any) {
  
  const [contactValue, setContactValue] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const [isContactValid, setIsContactValid] = useState(false);
  const [view, setView] = useState(props.show ? props.show : "login");

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
        <div className="w-[380px] h-[60vh] flex flex-col items-center justify-around max-w-xl mx-auto shadow-lg bg-white rounded-lg p-8 box-border">

          <h2 className="text-2xl font-bold text-gray-800">
            {view == "login" ?"LOGIN":""}
            {view == "signup" ?"Create Free Account":""}
            {view == "reset-password" ? <div><Link to="/login" onClick={()=>setView("login")}><ArrowLeftOutlined className='mr-10'/></Link><span className='mr-10'>Reset Password</span></div>:""}
          </h2>
          
          <Form layout="vertical" className="w-full" onFinish={handleLogin}>
            <Form.Item required className="mb-8">
              <EmailPhoneInput 
                value={contactValue} 
                onChange={setContactValue} 
                onValidationChange={setIsContactValid} 
                prefix={<UserOutlined className='text-grey'/>} 
                placeholder="Email or phone number"/>
            </Form.Item>
            {
              view != "reset-password" &&
              <Form.Item required className="mb-8">
                <Input.Password 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  prefix={<Icons.KeyOutline className='text-grey'/>} 
                  placeholder="Enter your password"/>
              </Form.Item>
            }
            {
              view == "signup" &&  
              <Form.Item required className="mb-8">
                <Input.Password 
                  value={otp} 
                  onChange={(e) => setOtp(e.target.value)} 
                  prefix={<Icons.KeyOutline className='text-grey'/>} 
                  placeholder="Enter OTP sent"/>
              </Form.Item>
            }

            { 
              view == "login" &&  
              <div className="flex justify-between mb-8">
                  <Checkbox value={rememberMe} onChange={(e:any)=>setRememberMe(e.target.checked)}>Remember me</Checkbox>
                  <Link to="/reset-password" className="text-link" onClick={()=>setView("reset-password")}>Forgot Password ?</Link>
              </div>
            }

            <Form.Item className="mb-0 flex justify-center">
              <Button type="primary" htmlType="submit">
                {view == "login" && <>Login Now</>}
                {view == "signup" && <>Continue & Send OTP</>}
                {view == "reset-password" && <>Send Verification Code</>}
              </Button>
            </Form.Item>
          </Form>

          <div className='flex flex-col items-center'>
            <p className="flex items-center gap-1 text-sm">
              { 
                view == "login" &&  <>
                  <span>Don't have an account ?</span>
                  <Link to="/signup" className="text-link" onClick={()=>setView("signup")}>Signup here</Link>
                </>
                }{ (view == "signup" || view == "reset-password") &&  <>
                  <span>Already had an account ?</span>
                  <Link to="/login" className="text-link" onClick={()=>setView("login")}>Login here</Link>
                </>
              }
            </p>
            {
              view == "signup" && 
              <p className='break-word text-center text-xs'>
                <span>By clicking continue, you agree to the</span>
                <Link className="ml-1 mr-1 text-link" to="/services-terms">Service terms</Link>
                <span>and</span>
                <Link className="ml-1 mr-1 text-link" to="/privacy-policy">Privacy Policy</Link>
              </p>
            }
          </div>
        </div>
      </main>
      <footer className="p-2 text-center text-gray-600 text-sm text-bold font-medium">
        <p>Famroot@2025</p>
      </footer>
    </div>
  );
}

export default Landing;
