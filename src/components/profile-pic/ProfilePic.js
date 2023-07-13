import PropTypes from "prop-types";

import "@components/profile-pic/ProfilePic.scss";

const ProfilePic = ({ src, className }) => {
	return (
		<>
			<img
				src={src}
				alt="Profile image"
				className={`profile-pic ${className}`}
			/>
		</>
	);
};

ProfilePic.propTypes = {
	src: PropTypes.string,
	className: PropTypes.string,
};

ProfilePic.defaultProps = {
	src: process.env.REACT_APP_PROFILE_PIC,
	className: "",
};

export default ProfilePic;
