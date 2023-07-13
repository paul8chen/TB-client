import { useRef } from "react";
import { Outlet } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import "@components/app-nav/AppNav.scss";
import Header from "@components/header/Header";
import Sidebar from "@components/sidebar/Sidebar";
import PostCard from "@components/posts/post-card/PostCard";
import { closeModal } from "@store/reducers/postModelReducer";

function AppNav() {
	const { isOpen, post, isEditable } = useSelector((state) => state.postModal);
	const modalWrapperRef = useRef();
	const dispatch = useDispatch();

	const modalClickHandler = (event) => {
		event.target.contains(modalWrapperRef.current) && dispatch(closeModal());
	};

	return (
		<>
			<div className="root">
				<Header />
				<div className="root-dashboard">
					<div className="root-sidebar">
						<Sidebar />
					</div>
					<div className="root-content">
						<Outlet />
					</div>
				</div>
			</div>
			{isOpen && (
				<div className="root-modal" onClick={modalClickHandler}>
					<div className="modal-wrapper" ref={modalWrapperRef}>
						<PostCard post={post} editable={isEditable} showComment={true} />
					</div>
				</div>
			)}
		</>
	);
}

export default AppNav;
