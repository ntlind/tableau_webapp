import { useEffect, useState, useRef, useCallback } from 'react';
import { CalculatorIcon } from '@heroicons/react/outline'
import { CalendarIcon } from '@heroicons/react/solid'
import Switch from '../components/ToggleSwitch'
import Listbox from './Listboxes/Listbox';
import ColorPickerWidget from "../components/ColorPicketWidget"
import LoadD3File from './LoadD3File';


export default function HeaderBar({ isOn, setIsOn, data, setData }: { isOn: boolean, setIsOn: any, data: any, setData: any }) {
    let iconList = getChartIconList()
    let typeChoices = Object.keys(iconList).map((key, index) => (key))

    function updateColor(e: string) {
        setData({ ...data, bg: e })
    }

    function updateRecentPalette() {
        let recentColors = data.recentColors
        recentColors.shift()
        recentColors.push(data.bg)
        setData({ ...data, recentColors: recentColors })
    }

    return (
        <div className='fixed w-full pr-4 h-14 pl-60 '>
            <div className='flex flex-row items-center justify-between h-full px-2 py-4 space-x-2'>
                <Listbox options={typeChoices} selected={data.chartType} data={data} setData={setData} iconMap={iconList} />
                <ColorPickerWidget icon={<CalendarIcon className='w-5 h-5 stroke-1' />} color={data.bg} recentPalette={data.recentColors} updateColor={updateColor} updatePalette={updateRecentPalette} />
                <button className='theme-button-outline' onClick={e => {
                    LoadD3File('/air_passengers.csv')
                        .then((response: any) => {
                            setData({ ...data, data: response['array'], cols: response['col_obj'] })
                        })
                }
                } >Load test data</button>
                <Switch isOn={isOn} setIsOn={(e: any) => setIsOn(e)} />
            </div>
        </div >
    );
}


export function getChartIconList() {
    let iconClass = "h-5 w-5 stroke-1 text-theme mr-2 dark:text-sky-200"

    let iconMap = {
        "BarChart": <CalculatorIcon className={iconClass} />,
        "LineChart": <CalculatorIcon className={iconClass} />,
        "Map": <CalculatorIcon className={iconClass} />,
        "ScatterPlot": <CalculatorIcon className={iconClass} />,
    }
    return (
        iconMap
    )
}