import { motion } from "framer-motion";
import styles from "./dialog.module.scss";

import { NextComponentType } from "next";
import React from "react";

const DialogComponent = (props: { children: any; dialogOpen: boolean }) => {
	return (
		<motion.div
			variants={{
				visible: {
					opacity: 1,
					transition: { duration: 0.3 },
					display: "flex",
				},
				hidden: {
					opacity: 0,
					transition: { duration: 0.3 },
					transitionEnd: {
						display: "none",
					},
				},
			}}
			initial="hidden"
			animate={props.dialogOpen ? "visible" : "hidden"}
			className={styles["dialog"]}
		>
			<div className={styles["dialog-content"]}>{props.children}</div>
		</motion.div>
	);
};

export default DialogComponent;
