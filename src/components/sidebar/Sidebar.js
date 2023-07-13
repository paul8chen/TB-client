import { NavLink } from "react-router-dom";
import { RiStockLine } from "react-icons/ri";
import { FaNewspaper, FaRegUser } from "react-icons/fa";

import "@components/sidebar/Sidebar.scss";

const Sidebar = () => {
	return (
		<div className="sidebar-container">
			<div className="sidebar-nav">
				<NavLink
					to="/app/chart"
					className={({ isActive }) =>
						isActive ? "sidebar-link active" : "sidebar-link"
					}
					end
				>
					<div className="link-icon">
						<RiStockLine className="icon" />
					</div>
					<div className="link-text">
						<span>chart</span>
					</div>
				</NavLink>
				<NavLink
					to="/app/post"
					className={({ isActive }) =>
						isActive ? "sidebar-link active" : "sidebar-link"
					}
				>
					<div className="link-icon">
						<FaNewspaper className="icon" />
					</div>
					<div className="link-text">
						<span>post</span>
					</div>
				</NavLink>
				<NavLink
					to="/app/profile"
					className={({ isActive }) =>
						isActive ? "sidebar-link active" : "sidebar-link"
					}
				>
					<div className="link-icon">
						<FaRegUser className="icon" />
					</div>
					<div className="link-text">
						<span>profile</span>
					</div>
				</NavLink>
			</div>
		</div>
	);
};

export default Sidebar;
