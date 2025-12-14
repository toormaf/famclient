import { Link } from "react-router-dom";
const Logo = ( ) => {
    return (
    <Link to="/" className="flex">
        <img className="w-[100px]" src="/src/public/image/favicon.svg" alt="Famroot"/>
    </Link>
    );
}
export default Logo;