import { useEffect, useState, useRef, useCallback } from 'react';
import { AtSymbolIcon, PhoneIcon, VariableIcon, DocumentTextIcon, CalculatorIcon } from '@heroicons/react/outline'
import { CalendarIcon } from '@heroicons/react/solid'
import Switch from '../components/ToggleSwitch'
import Listbox from './Listboxes/Listbox';
import { HexColorPicker } from "react-colorful";
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

    const close = useCallback(() => setShowPicker(false), []);
    useClickOutside(popover, close);

    return (
        <button className='relative px-2 py-1 border rounded border-slate-900 dark:border-white' onClick={e => setShowPicker(true)}>
            <div className='flex flex-col items-center justify-center space-y-1 dark:text-white text-slate-900'>
                <CalendarIcon className='w-5 h-5 stroke-1' />
                <span className='w-4 h-[.4rem]' style={{ background: data.bg }}></span>
            </div>
            <div className='absolute left-0 top-10'>
                {showPicker &&
                    <div ref={popover} >< HexColorPicker color={data.bg} onChange={e => setData({ ...data, bg: e })} />
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