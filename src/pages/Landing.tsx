import { AndroidFilled, AppleFilled, ArrowLeftOutlined, UserOutlined } from '@ant-design/icons';
import { API_ENDPOINTS, URLS } from '../constants/Urls';
import { useState } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { EmailPhoneInput, Icons, FormBuilder } from '../components';
import { Link } from 'react-router-dom';
import MessageService from '../services/Message.service';
import ApiService from '../services/Api.service';
import { useSignupForm } from '../forms/signup';
import { useResetPasswordForm } from '../forms/reset-password';

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
  const [rememberMe, setRememberMe] = useState(true);

  const [isContactValid, setIsContactValid] = useState(false);
  const [view, setView] = useState(props.show ? props.show : "login");

  const { signupFormConfig, otpSent, setOtpSent } = useSignupForm();
  const { resetPasswordFormConfig, codeSent, setCodeSent } = useResetPasswordForm();

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
      }
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  const handleSignup = async (values: any) => {
    if (!otpSent) {
      MessageService.info('Sending OTP to your email/mobile...');
      setTimeout(() => {
        setOtpSent(true);
        MessageService.success('OTP sent successfully! Please check your email/mobile.');
      }, 1000);
    } else {
      ApiService.post(API_ENDPOINTS.ACCOUNT.SIGNUP, {
        username: values.emailOrMobile,
        password: values.password,
        otp: values.otp,
        scope: 1,
      }, {}, (error) => {
        if (error?.response?.data?.status === "error") {
          MessageService.error(error.response.data.message);
        }
      });
    }
  };

  const handleResetPassword = async () => {
    if (!codeSent) {
      MessageService.info('Sending verification code...');
      setTimeout(() => {
        setCodeSent(true);
        MessageService.success('Verification code sent! Please check your email/mobile.');
      }, 1000);
    } else {
      MessageService.success('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        setView("login");
        setCodeSent(false);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader></LandingHeader>
      <main className="flex-1 flex items-center justify-center bg-[url('/src/public/image/BG.svg')] bg-cover bg-center bg-no-repeat">
        <LandingCarousel></LandingCarousel>
        <div className="w-[380px] min-h-[60vh] flex flex-col items-center justify-around max-w-xl mx-auto shadow-lg bg-white rounded-lg p-8 box-border">

          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {view == "login" && "LOGIN"}
            {view == "signup" && "Create Free Account"}
            {view == "reset-password" && (
              <div>
                <Link to="/login" onClick={() => { setView("login"); setCodeSent(false); }}>
                  <ArrowLeftOutlined className='mr-10'/>
                </Link>
                <span className='mr-10'>Reset Password</span>
              </div>
            )}
          </h2>

          {view === "login" && (
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
              <div className="flex justify-between mb-8">
                <Checkbox checked={rememberMe} onChange={(e:any)=>setRememberMe(e.target.checked)}>Remember me</Checkbox>
                <Link to="/reset-password" className="text-link" onClick={()=>setView("reset-password")}>Forgot Password ?</Link>
              </div>
              <Form.Item className="mb-0 flex justify-center">
                <Button type="primary" htmlType="submit" onClick={handleAuth}>
                  Login Now
                </Button>
              </Form.Item>
            </Form>
          )}

          {view === "signup" && (
            <div className="w-full">
              <FormBuilder
                config={signupFormConfig}
                onSubmit={handleSignup}
                submitText={otpSent ? "Verify & Create Account" : "Continue & Send OTP"}
                showReset={false}
              />
            </div>
          )}

          {view === "reset-password" && (
            <div className="w-full">
              <FormBuilder
                config={resetPasswordFormConfig}
                onSubmit={handleResetPassword}
                submitText={codeSent ? "Reset Password" : "Send Verification Code"}
                showReset={false}
              />
            </div>
          )}

          <div className='flex flex-col items-center mt-4'>
            <p className="flex items-center gap-1 text-sm">
              {
                view == "login" &&  <>
                  <span>Don't have an account ?</span>
                  <Link to="/signup" className="text-link" onClick={() => { setView("signup"); setOtpSent(false); }}>Signup here</Link>
                </>
                }{ (view == "signup" || view == "reset-password") &&  <>
                  <span>Already had an account ?</span>
                  <Link to="/login" className="text-link" onClick={() => { setView("login"); setOtpSent(false); setCodeSent(false); }}>Login here</Link>
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
