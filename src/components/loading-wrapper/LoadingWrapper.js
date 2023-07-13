import React, { useState } from "react";
import PropTypes from "prop-types";

import "@components/loading-wrapper/LoadingWrapper.scss";
import Spinner from "@components/spinner/Spinner";

function LoadingWrapper(props) {
	const [isInitLoading, setIsInitLoading] = useState(true);
	const childrenWithProps = React.cloneElement(props.children, {
		...props,
		setIsInitLoading,
	});

	return (
		<>
			{isInitLoading && (
				<div className="loading-wrapper">
					<Spinner />
				</div>
			)}
			{childrenWithProps}
		</>
	);
}

LoadingWrapper.propTypes = {
	children: PropTypes.object,
};

export default LoadingWrapper;
