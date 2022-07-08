import { motion } from "framer-motion";
import { useState } from "react";
import { MoonIcon } from '@heroicons/react/solid'
import { SunIcon } from '@heroicons/react/solid'

interface IProps {
    isOn: boolean,
    setIsOn: any
}

export default function Switch({ isOn, setIsOn }: IProps) {
    const toggleSwitch = () => setIsOn(!isOn);

    return (
        <div
            className={isOn ? "bg-slate-600 justify-end" : "bg-slate-200"}
            style={{
                width: "3.2rem",
                padding: "0.25rem",
                display: "flex",
                borderRadius: 9999,
                cursor: "pointer",
            }}
            onClick={toggleSwitch}
        >
            {/* Switch knob */}
            <motion.div
                className={isOn ? "items-center justify-center text-center bg-slate-900" : "items-center justify-center text-center bg-slate-50"}
                style={{
                    width: "1.5rem",
                    height: "1.5rem",
                    borderRadius: "100%",
                    boxShadow:
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                }}
                layout
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                }}
            >
                {isOn ? <MoonIcon className="p-1 text-white" /> : <SunIcon className="text-slate-900" />}
            </motion.div>
        </div>
    );
};