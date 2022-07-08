import { useEffect, useState, useRef, useCallback } from 'react';
import { HexColorPicker, HexColorInput } from "react-colorful";
import useClickOutside from '../components/CustomHooks/useClickOutside'

export default function ColorPickerWidget({ icon, color, recentPalette, updateColor, updatePalette }: { icon: any, color: string, recentPalette: Array<string>, updateColor: any, updatePalette?: any }) {
    const [showPicker, setShowPicker] = useState(false);
    const popover = useRef(null);

    useEffect(() => {
        if (!recentPalette.includes(color)) {
            updatePalette()
        }
    }, [showPicker])

    const close = useCallback(() => {
        setShowPicker(false)
    }, []);
    useClickOutside(popover, close);

    return (
        <button className='relative px-2 py-1 border rounded shadow-inner border-slate-400 dark:border-white' onClick={e => setShowPicker(true)}>
            <div className='flex flex-col items-center justify-center space-y-[.1rem] dark:text-white text-slate-900'>
                {icon}
                <span className='w-4 h-[.4rem]' style={{ background: color }}></span>
            </div>
            <div className='absolute left-0 top-10'>
                {showPicker &&
                    <div ref={popover} className='cursor-default'>
                        <div className='bg-white rounded-b'>
                            <HexColorPicker color={color} onChange={e => updateColor(e)} />
                            <div className='flex flex-row items-center justify-between px-2'>
                                <div className='flex flex-row items-center justify-start'>
                                    <div className='w-4 h-4 mr-1' style={{ background: color }}></div>
                                    <HexColorInput className='w-16 text-center uppercase' color={color} onChange={e => updateColor(e)} />
                                </div>
                                <div className='flex flex-row items-center justify-end'>
                                    {recentPalette.map((color: string) => (
                                        <button key={color} className='w-4 h-4 mr-1' style={{ background: color }} onClick={e => updateColor(color)}></button>)
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </button>
    )
}