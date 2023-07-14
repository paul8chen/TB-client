import PropTypes from "prop-types";
import { useState, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { RiSendPlane2Line } from "react-icons/ri";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import { BsEmojiSmile } from "react-icons/bs";
import { TbLoader } from "react-icons/tb";

import "@components/textAreaInput/TextAreaInput.scss";
import useClickOutside from "@hooks/useClickOutside";

function TextAreaInput({
	onSubmit,
	className,
	emojiPickerStyle,
	value,
	placeholder,
}) {
	const emojiPickerRef = useRef();
	const [inputValue, setInputValue] = useState(value);
	const [isInputValid, setIsInputValid] = useState();
	const [isEmojiClicked, setIsEmojiClicked] = useClickOutside(emojiPickerRef);
	const [isLoading, setIsLoading] = useState();

	const textAreaChangeHandler = (event) => {
		const el = event.target;
		const value = el.value;
		setInputValue(value);
		value.split("\n").join("").length > 0
			? setIsInputValid(true)
			: setIsInputValid(false);
	};

	const emojiPickerClickHandler = () => {
		setIsEmojiClicked(true);
	};

	const emojiClickHandler = (emojiData) => {
		const emoji = emojiData.emoji;
		setInputValue((state) => (state ? state + emoji : emoji));
		setIsInputValid(true);
	};

	const textAreaSubmitHandler = async (event) => {
		event.preventDefault();
		console.log("submitted");
		setIsInputValid(false);
		setIsLoading(true);
		await onSubmit(inputValue);
		setIsLoading(false);
		setInputValue("");
	};

	return (
		<>
			<form onSubmit={textAreaSubmitHandler} className="textArea-form">
				<TextareaAutosize
					autoFocus
					value={inputValue}
					placeholder={placeholder || "say something..."}
					onChange={textAreaChangeHandler}
					className={className}
				/>

				<div className="textArea-tool">
					<div
						ref={emojiPickerRef}
						onClick={emojiPickerClickHandler}
						className="textArea-emojiPicker-wraper"
					>
						<BsEmojiSmile className="icon" />
						{isEmojiClicked && (
							<div className="textArea-emojiPicker" style={emojiPickerStyle}>
								<EmojiPicker
									onEmojiClick={emojiClickHandler}
									autoFocusSearch={false}
									emojiStyle={EmojiStyle.NATIVE}
								/>
							</div>
						)}
					</div>
					<button
						type="submit"
						className={`textArea-btn ${isInputValid ? "active" : ""}`}
						disabled={!isInputValid}
					>
						{!isLoading && <RiSendPlane2Line className="icon" />}
						{isLoading && <TbLoader className="icon loading" />}
					</button>
				</div>
			</form>
		</>
	);
}

TextAreaInput.propTypes = {
	onSubmit: PropTypes.func,
	className: PropTypes.string,
	emojiPickerStyle: PropTypes.object,
	value: PropTypes.string,
	placeholder: PropTypes.string,
};

TextAreaInput.defaultProps = {
	onSubmit: () => {},
	emojiPickerStyle: {},
	value: "",
};

export default TextAreaInput;
