import { Avatar, Badge, Drawer, Dropdown, Image, Layout, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import * as Aicon from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Content, Header } from "antd/es/layout/layout";
import Logo from "../components/Logo";
import AccountService from "../services/Account.service";
import { useEffect, useState } from "react";

const sideMenuItems = [
    {key: "home", icon: <Aicon.DashboardOutlined />, label: "Home"},
    {key: "connects",icon: <Aicon.TeamOutlined />,label: "Connects"},
    {key: "chats",icon: <Aicon.MessageOutlined />,label: "Chats"},
    {key: "vault",icon: <Aicon.SafetyOutlined />,label: "Vault"},
    {key: "notes",icon: <Aicon.FileTextOutlined />,label: "Notes"},
    {key: "maps",icon: <Aicon.CompassOutlined />,label: "Maps"}
];




const FamrootLayout = (props:any)=>{

    const [basic, setBasic]:any=useState(undefined);
    const [dp, setDp]:any = useState(undefined);

    const [drawerVisible, setDrawerVisible] = useState(false);
    const closeDrawer = () => {setDrawerVisible(false);};

    useEffect(() => {
        (async () => {
            setBasic(await AccountService.fetchBasic());
            setDp(await AccountService.getDpSrc());
        })();
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    const navigate = useNavigate();
    const handleMenuSwitch = (menu:any) =>{
        navigate("/"+menu.key);
    }
    const userMenuItems:any = [
        {
            label:<>
                <div className="flex justify-center items-center gap-5 profile-dropdown">
                    <div className="w-[44px] rounded"><Image src={dp}></Image></div>
                    
                    <div className="flex flex-col">
                        <span className="font-bold">{basic?.firstName}</span>
                        <span>{basic?.loginId}</span>
                    </div>
                </div>
            </>,
            key:"info"
        },
        {type: 'divider'},
        {label: "Profile",key:"profile",icon:<Aicon.UserOutlined />},
        {label: "Timeline",key:"timeline",icon:<Aicon.FieldTimeOutlined />},
        {type: 'divider'},
        {label: "Logout",key: "logout",icon:<Aicon.LogoutOutlined />}
    ];

    const userMenuClick= (item:any) => {
        if(item.key === "profile"){
            navigate("/profile");
        }else if(item.key === "timeline"){
            navigate("/timeline");
        }else if(item.key === "logout"){
            AccountService.logout();
        }
    }
    return(
        <Layout className="main-layout">
            {/* <NotificationSocket setDrawerVisibility={setDrawerVisible}></NotificationSocket>
            {
                popoverVisible && 
                <DCPopup size="large" section={"basic"} title={"Add Details"} visibiltyCallback={setPopoverVisibility} popoverRefId={popoverRefId} popoverRefData={{type:"main"}}></DCPopup>
            }
            {
                authData.authenticateToFamily &&
                <VerifyIdentityPopup title={"Verify Identity"}></VerifyIdentityPopup>
            } */}
            <Header className="flex justify-between">
                <Logo/>
                <div className="flexr-ac gap20">
                    {/* <HighScreen>
                        <GlobalTextBox allowTags={true} className="txt-al"/>
                    </HighScreen>
                    <Mobile>
                        <Aicon.SearchOutlined className="txt20"/>
                    </Mobile> */}
                    <Aicon.SettingOutlined className="txt20" onClick={()=>handleMenuSwitch({key:'settings'})}/>
                    <Badge size="small" count={1}>
                        <Aicon.BellOutlined className="txt20" onClick={()=>setDrawerVisible(true)} /> 
                    </Badge>
                    <Drawer title="Notifications" className={"notification-drawer"} open={drawerVisible} onClose={closeDrawer}>
                        {/* <NotificationList></NotificationList> */}
                    </Drawer>
                    <Dropdown trigger={['click']} menu={{items:userMenuItems, onClick: userMenuClick}}>
                        <Avatar className="hauto main-avatar" src={dp}/>
                    </Dropdown>
                </div>
            </Header>
            {/* <div className="meter red" style={{opacity: mainData.loaderCount > 0 ? "1":"0"}}></div> */}
            <Layout style={{"height":'calc(100vh - 45px)'}}>
                <Sider width={70}>
                    <Menu className="layout-side-menu" items={sideMenuItems} selectedKeys={[props.selected]} onClick={handleMenuSwitch}/>
                </Sider>
                <Layout className="bg-white">
                <Content>
                        {props.children}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
}

export default FamrootLayout;