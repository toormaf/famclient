import { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, HashRouter, useLocation, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import ApiService from './services/Api.service';
import AccountService from './services/Account.service';
import { URLS } from './constants/Urls';
import FamrootLayout from './layouts/FamrootLayout';
import FormBuilderDemo from './pages/FormBuilderDemo';

const Landing = lazy(() => import('./pages/Landing'));
const Home = lazy(() => import('./pages/modules/Home'));
const Connects = lazy(() => import('./pages/modules/Connects'));
const Chat = lazy(() => import('./pages/modules/Chat'));
const Vault = lazy(() => import('./pages/modules/Vault'));
const Notes = lazy(() => import('./pages/modules/Notes'));
const Maps = lazy(() => import('./pages/modules/Maps'));
const Settings = lazy(() => import('./pages/Settings'));
const Profile = lazy(() => import('./pages/Profile'));
const Timeline = lazy(()=>import("./pages/Timeline"));

// const DashboardLayout = lazy(() => import('./layouts/DashboardLayout'));

function A(props:any){

  const location = useLocation();
  const [checkDone, setCheckDone]:any = useState(null);
  const [isAuthenticated, setIsAuthenticated]:any = useState(null);

  useEffect(() => {
      (async () => {
        setIsAuthenticated((await AccountService.fetchBasic())?.uid > 0);
        setCheckDone(true);
      })();
  }, []);// eslint-disable-line react-hooks/exhaustive-deps

  if(checkDone){
      if((isAuthenticated && props.allow == undefined || props.allow == "auth") || (!isAuthenticated && props.allow == "unauth")){
        return props.children;
      }else if(isAuthenticated){
        return(<Navigate to={URLS.HOME_URL} state={{ from: location }} />);
      }else if(!isAuthenticated){
        return(<Navigate to={URLS.LOGIN_URL} state={{ from: location }} />);
      }    
  }else{
      return null;
  }
}

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Spin size="large" />
  </div>
);

function App() {
    if(ApiService.init()){
    return (
      <HashRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/"                 element={<A allow={"unauth"}><Landing show="login"/></A>}/>
            <Route path="/login"            element={<A allow={"unauth"}><Landing show="login"/></A>}/>
            <Route path="/signup"           element={<A allow={"unauth"}><Landing show="signup"/></A>}/>
            <Route path="/reset-password"   element={<A allow={"unauth"}><Landing show="reset-password"/></A>}/>
            <Route path="/home/*"           element={<A ><FamrootLayout selected="home"><Home/></FamrootLayout></A>}/>
            <Route path="/connects/*"       element={<A ><FamrootLayout selected="connects"><Connects/></FamrootLayout></A>}/>
            <Route path="/chats"            element={<A ><FamrootLayout selected="chats"><Chat/></FamrootLayout></A>}/>
            <Route path="/vault"            element={<A ><FamrootLayout selected="vault"><Vault/></FamrootLayout></A>}/>
            <Route path="/notes"            element={<A ><FamrootLayout selected="notes"><Notes/></FamrootLayout></A>}/>
            <Route path="/maps"             element={<A ><FamrootLayout selected="maps"><Maps/></FamrootLayout></A>}/>
            <Route path="/settings/*"       element={<A ><FamrootLayout><FormBuilderDemo/></FamrootLayout></A>}/>
            <Route path="/profile/*"        element={<A ><FamrootLayout><Profile/></FamrootLayout></A>}/>
            <Route path="/timeline/*"        element={<A ><FamrootLayout><Timeline/></FamrootLayout></A>}/>
          </Routes>
        </Suspense>
      </HashRouter>
    );
  }

}

export default App;
