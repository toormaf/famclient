import { AndroidFilled , AppleFilled} from '@ant-design/icons';
import { URLS } from './Urls';
import { useState } from 'react';

function Landing() {
  const [index, setIndex] = useState(0);
  return (
    <div className="min-h-screen flex flex-col">
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

      <main className="flex-1 flex items-center justify-center bg-[url('/src/public/image/BG.svg')] bg-cover bg-center bg-no-repeat">
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
        <div className="w-[380px] h-[60vh] flex flex-col items-center max-w-xl mx-auto shadow-lg bg-white br-1 rounded p-10 box-border">
            <h2>LOGIN</h2>
        </div>
      </main>

      <footer className="p-2 text-center text-gray-600 text-sm text-bold font-medium">
        <p>Famroot@2025</p>
      </footer>
    </div>
  );
}

export default Landing;
