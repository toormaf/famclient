import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, HashRouter } from 'react-router-dom';
import { Spin } from 'antd';
import ApiService from './services/Api.service';
import MessageService from './services/Message.service';

const Landing = lazy(() => import('./pages/Landing'));
const Home = lazy(() => import('./pages/modules/Home'));
const Connects = lazy(() => import('./pages/modules/Connects'));
const Chat = lazy(() => import('./pages/modules/Chat'));
const Vault = lazy(() => import('./pages/modules/Vault'));
const Notes = lazy(() => import('./pages/modules/Notes'));
const Maps = lazy(() => import('./pages/modules/Maps'));
const Settings = lazy(() => import('./pages/Settings'));
const Profile = lazy(() => import('./pages/Profile'));

// const DashboardLayout = lazy(() => import('./layouts/DashboardLayout'));

function UA(props:any){return (<>{props.children}</>)}
function A(props:any){return (<>{props.children}</>)}
function FamrootLayout(props:any){return (<>{props.children}</>)}

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Spin size="large" />
  </div>
);

function App() {
  useEffect(() => {
    ApiService.init();
    MessageService.setConfig({maxCount: 1});
  }, []);// eslint-disable-line react-hooks/exhaustive-deps

  return (
    <HashRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/"                 element={<UA><Landing show="login"/></UA>}/>
          <Route path="/login"            element={<UA><Landing show="login"/></UA>}/>
          <Route path="/signup"           element={<UA><Landing show="signup"/></UA>}/>
          <Route path="/reset-password"   element={<UA><Landing show="reset-password"/></UA>}/>
          <Route path="/home/*"           element={<A ><FamrootLayout><Home/></FamrootLayout></A>}/>
          <Route path="/connects/*"       element={<A ><FamrootLayout><Connects/></FamrootLayout></A>}/>
          <Route path="/chats"            element={<A ><FamrootLayout><Chat/></FamrootLayout></A>}/>
          <Route path="/vault"            element={<A ><FamrootLayout><Vault/></FamrootLayout></A>}/>
          <Route path="/notes"            element={<A ><FamrootLayout><Notes/></FamrootLayout></A>}/>
          <Route path="/maps"             element={<A ><FamrootLayout><Maps/></FamrootLayout></A>}/>
          <Route path="/settings/*"       element={<A ><FamrootLayout><Settings/></FamrootLayout></A>}/>
          <Route path="/profile/*"        element={<A ><FamrootLayout><Profile/></FamrootLayout></A>}/>
        </Routes>
      </Suspense>
    </HashRouter>
  );
}

export default App;
