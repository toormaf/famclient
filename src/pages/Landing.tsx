import { AndroidFilled, AppleFilled, ArrowLeftOutlined, UserOutlined } from '@ant-design/icons';
import { API_ENDPOINTS, URLS } from '../constants/Urls';
import { useState } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { EmailPhoneInput, Icons } from '../components';
import { Link } from 'react-router-dom';
import MessageService from '../services/Message.service';
import ApiService from '../services/Api.service';

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

  const [form] = Form.useForm();
  const [contactValue, setContactValue] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const [isContactValid, setIsContactValid] = useState(false);
  const [view, setView] = useState(props.show ? props.show : "login");

  const formData = ()=>{
    return {
      username: contactValue,
      password: password,
      scope: 1,
      remember: rememberMe
    };
  }

  const handleAuth = async () => {
    try {
      await form.validateFields();

      if(view == "login"){
        ApiService.post(API_ENDPOINTS.ACCOUNT.LOGIN,formData(),{},(error)=>{
          if(error?.response?.data?.status === "error"){
            if(error.response.data.message.indexOf("try signup") > -1){
                setView("signup");
            }else{
                MessageService.error(error.response.data.message);
            }
          }
        });
      }else if(view == "signup"){
        ApiService.post(API_ENDPOINTS.ACCOUNT.SIGNUP,formData(),{},(error)=>{
          if(error?.response?.data?.status === "error"){
            MessageService.error(error.response.data.message);
          }
        });
      }else if(view == "reset-password"){
        MessageService.success('Password reset link sent to your email/phone');
      }
    } catch (error) {
      console.error('Form validation failed:', error);
    }
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
          
          <Form
            form={form}
            layout="vertical"
            className="w-full"
            validateTrigger={['onBlur', 'onSubmit']}
          >
            <Form.Item
              name="contact"
              rules={[
                { required: true, message: 'Please enter your email or phone number' },
                {
                  validator: (_, value) => {
                    if (!value) return Promise.resolve();
                    if (!isContactValid) {
                      return Promise.reject(new Error('Please enter a valid email or phone number'));
                    }
                    return Promise.resolve();
                  }
                }
              ]}
              validateTrigger={['onBlur']}
              className="mb-8"
            >
              <EmailPhoneInput
                value={contactValue}
                onChange={(value) => {
                  setContactValue(value);
                  form.setFieldValue('contact', value);
                }}
                onValidationChange={setIsContactValid}
                prefix={<UserOutlined className='text-grey'/>}
                placeholder="Email or phone number"
              />
            </Form.Item>
            {
              view != "reset-password" &&
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: 'Please enter your password' },
                  { min: 3, message: 'Password must be at least 6 characters' }
                ]}
                validateTrigger={['onBlur']}
                className="mb-8"
              >
                <Input.Password
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    form.setFieldValue('password', e.target.value);
                  }}
                  prefix={<Icons.KeyOutline className='text-grey'/>}
                  placeholder="Enter your password"
                />
              </Form.Item>
            }
            {
              view == "signup" &&
              <Form.Item
                name="otp"
                rules={[
                  { required: true, message: 'Please enter the OTP sent to you' },
                  { len: 6, message: 'OTP must be 6 digits' },
                  { pattern: /^\d+$/, message: 'OTP must contain only numbers' }
                ]}
                validateTrigger={['onBlur']}
                className="mb-8"
              >
                <Input
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value);
                    form.setFieldValue('otp', e.target.value);
                  }}
                  prefix={<Icons.KeyOutline className='text-grey'/>}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                />
              </Form.Item>
            }

            {
              view == "login" &&
              <div className="flex justify-between mb-8">
                  <Checkbox checked={rememberMe} onChange={(e:any)=>setRememberMe(e.target.checked)}>Remember me</Checkbox>
                  <Link to="/reset-password" className="text-link" onClick={()=>setView("reset-password")}>Forgot Password ?</Link>
              </div>
            }

            <Form.Item className="mb-0 flex justify-center">
              <Button type="primary" htmlType="submit" onClick={handleAuth}>
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
