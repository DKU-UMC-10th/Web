import { NavLink } from "react-router-dom"

const LINKS = [
    { to : '/', label: 'Home' },
    { to : '/movies/popular', label: 'Popular' },
    { to : '/movies/now-playing', label: 'Now Playing' },
    { to : '/movies/top-rated', label: 'Top Rated' },
    { to : '/movies/upcoming', label: 'Upcoming' },
];

export const Navbar = () => {
    return (
    <div className='flex gap-3 p-4'>
        {LINKS.map(({to, label}) => (
            <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                    isActive ? 'text-green-500 font-bold' : 'text-gray-500'
                }
        >
            {label}
        </NavLink>
    ))}
    </div>
    );
};

export default Navbar;