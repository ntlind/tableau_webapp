import { useEffect, useState, useRef } from 'react';
import { CalendarIcon, AtSymbolIcon, PhoneIcon, VariableIcon, DocumentTextIcon, CalculatorIcon } from '@heroicons/react/outline'
import Listbox from './Listboxes/Listbox';

interface IProps {
    state: any;
    setState: any;
    data: any;
    setData: any
}

export default function HeaderBar({ state, setState, data, setData }: IProps) {

    let iconList = getChartIconList()
    let typeChoices = Object.keys(iconList).map((key, index) => (key))

    return (
        <div className='fixed w-full shadow h-14 ml-60 dark:bg-slate-900 '>
            <div className='flex flex-row items-center h-full px-2 py-4'>
                <Listbox options={typeChoices} selected={data.chartType} data={data} setData={setData} iconMap={iconList} />
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