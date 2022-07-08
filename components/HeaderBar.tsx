import { useEffect, useState, useRef, useCallback } from 'react';
import { AtSymbolIcon, PhoneIcon, VariableIcon, DocumentTextIcon, CalculatorIcon } from '@heroicons/react/outline'
import { CalendarIcon } from '@heroicons/react/solid'
import Switch from '../components/ToggleSwitch'
import Listbox from './Listboxes/Listbox';
import { HexColorPicker, HexColorInput } from "react-colorful";
import useClickOutside from '../components/CustomHooks/useClickOutside'

interface IProps {
    state: any;
    setState: any;
    data: any;
    setData: any
}

function BackgroundColorPicker({ data, setData }: { data: any, setData: any }) {
    const [showPicker, setShowPicker] = useState(false);
    const popover = useRef(null);

    useEffect(() => {
        if (!data.recentColors.includes(data.bg)) {
            updateRecentColors()
        }
    }, [showPicker])

    function updateColor(e: string) {
        setData({ ...data, bg: e })
    }

    function updateRecentColors() {
        let recentColors = data.recentColors
        recentColors.shift()
        recentColors.push(data.bg)
        setData({ ...data, recentColors: recentColors })
    }

    const close = useCallback(() => {
        setShowPicker(false)
    }, []);
    useClickOutside(popover, close);

    return (
        <button className='relative px-2 py-1 border rounded border-slate-900 dark:border-white' onClick={e => setShowPicker(true)}>
            <div className='flex flex-col items-center justify-center space-y-1 dark:text-white text-slate-900'>
                <CalendarIcon className='w-5 h-5 stroke-1' />
                <span className='w-4 h-[.4rem]' style={{ background: data.bg }}></span>
            </div>
            <div className='absolute left-0 top-10'>
                {showPicker &&
                    <div ref={popover} className='cursor-default'>
                        <div className='bg-white rounded-b'>
                            <HexColorPicker color={data.bg} onChange={e => updateColor(e)} />

                            <div className='flex flex-row items-center justify-between px-2'>
                                <div className='flex flex-row items-center justify-start'>
                                    <div className='w-4 h-4 mr-1' style={{ background: data.bg }}></div>
                                    <HexColorInput className='w-16 text-center uppercase' color={data.bg} onChange={e => updateColor(e)} />
                                </div>
                                <div className='flex flex-row items-center justify-end'>
                                    {data.recentColors.map((color: string) => (
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

export default function HeaderBar({ state, setState, data, setData }: IProps) {

    let iconList = getChartIconList()
    let typeChoices = Object.keys(iconList).map((key, index) => (key))
    return (
        <div className='fixed w-full pr-24 shadow h-14 pl-60 bg-slate-50 dark:bg-slate-900'>
            <div className='flex flex-row items-center justify-between h-full px-2 py-4 space-x-2'>
                <Listbox options={typeChoices} selected={data.chartType} data={data} setData={setData} iconMap={iconList} />
                <BackgroundColorPicker data={data} setData={setData} />
                <Switch isOn={data.dark} setIsOn={e => setData({ ...data, dark: e })} />
            </div>
        </div >
    );
}


export function getChartIconList() {
    let iconClass = "h-5 w-5 stroke-1 text-theme mr-2 dark:text-sky-200"

    let iconMap = {
        "Bar Chart": <CalculatorIcon className={iconClass} />,
        "Line Chart": <CalculatorIcon className={iconClass} />,
        "Map": <CalculatorIcon className={iconClass} />,
        "Scatter Plot": <CalculatorIcon className={iconClass} />,
    }
    return (
        iconMap
    )
}