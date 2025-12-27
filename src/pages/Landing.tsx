import { AndroidFilled, AppleFilled, ArrowLeftOutlined } from '@ant-design/icons';
import { API_ENDPOINTS, URLS } from '../constants/Urls';
import { useState } from 'react';
import { FormBuilder } from '../components';
import { Link } from 'react-router-dom';
import MessageService from '../services/Message.service';
import ApiService from '../services/Api.service';
import { useLoginForm } from '../forms/login';
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
  const [ initialValues, setInitialValues ] = useState({});
  const [ view, setView ] = useState(props.show ? props.show : "login");
  const { loginFormConfig } = useLoginForm();
  const { signupFormConfig, otpSent, setOtpSent } = useSignupForm();
  const { resetPasswordFormConfig, codeSent, setCodeSent } = useResetPasswordForm();

  const handleLogin = async (values:any)=>{
    setInitialValues(values);
    ApiService.post(API_ENDPOINTS.ACCOUNT.LOGIN,{...values, scope:1},{},(error)=>{
      if(error?.response?.data?.status === "error"){
        if(error.response.data.message.indexOf("try signup") > -1){
            setView("signup");
        }else{
            MessageService.error(error.response.data.message);
        }
      }
    });
  }
  
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

          {view === "login" && <>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">LOGIN</h2>
            <div className="w-full">            
              <FormBuilder initialValues={initialValues} config={loginFormConfig} onSubmit={handleLogin} submitText={"Login Now"}/>
            </div>
            <div className='flex flex-col items-center mt-4'>
              <p className="flex items-center gap-1 text-sm">
                <span>Don't have an account ?</span>
                <Link to="/signup" className="text-link" onClick={() => { setView("signup"); setOtpSent(false); }}>Signup here</Link>
              </p>
            </div>
          </>}

          {view === "signup" && <>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Create Free Account</h2>
            <div className="w-full">
              <FormBuilder initialValues={initialValues} config={signupFormConfig} onSubmit={handleSignup} submitText={otpSent ? "Create my family tree" : "Continue & Send OTP"}/>
            </div>
            <div className='flex flex-col items-center mt-4'>
              <p className="flex items-center gap-1 text-sm">
                  <span>Already had an account ?</span>
                  <Link to="/login" className="text-link" onClick={() => { setView("login"); setOtpSent(false); setCodeSent(false); }}>Login here</Link>
              </p>
            </div>
            <p className='break-word text-center text-xs'>
              <span>By clicking continue, you agree to the</span>
              <Link className="ml-1 mr-1 text-link" to="/services-terms">Service terms</Link>
              <span>and</span>
              <Link className="ml-1 mr-1 text-link" to="/privacy-policy">Privacy Policy</Link>
            </p>
          </>}

          {view === "reset-password" && (<>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              <div>
                <Link to="/login" onClick={() => { setView("login"); setCodeSent(false); }}>
                  <ArrowLeftOutlined className='mr-10'/>
                </Link>
                <span className='mr-10'>Reset Password</span>
              </div>
            </h2>
            <div className="w-full">
              <FormBuilder initialValues={initialValues} config={resetPasswordFormConfig} onSubmit={handleResetPassword} submitText={codeSent ? "Reset Password" : "Send Verification Code"}/>
            </div>
            <div className='flex flex-col items-center mt-4'>
              <p className="flex items-center gap-1 text-sm">
                  <span>Already had an account ?</span>
                  <Link to="/login" className="text-link" onClick={() => { setView("login"); setOtpSent(false); setCodeSent(false); }}>Login here</Link>
              </p>
            </div>
          </>)}

        </div>
      </main>
      <footer className="p-2 text-center text-gray-600 text-sm text-bold font-medium">
        <p>Famroot@2025</p>
      </footer>
    </div>
  );
}

export default Landing;
