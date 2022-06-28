import React, { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'

interface CustomListBoxProps {
    id: any,
    choices: any,
    selected: any,
    onChange: any,
    abbreviate?: any,
    iconMap?: any
}

export default function CustomListBox({ id, choices, selected, onChange, abbreviate = false, iconMap = null }: CustomListBoxProps) {
    return (
        <div className="w-full">
            <Listbox value={selected} onChange={onChange}>
                <div className="relative mt-1 flex justify-center items-center">
                    <Listbox.Button className="form-format pl-1 pr-3">
                        <span className="block truncate text-lg text-center align-middle">{abbreviate ? selected.value.match(/\b([A-Z])/g).join('') : (iconMap ? iconMap[selected.value].icon : selected.value)}</span>
                        <span className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
                            <SelectorIcon
                                className="w-3 h-3 text-gray-400"
                                aria-hidden="true"
                            />
                        </span>
                    </Listbox.Button>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-xl border-theme border max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                            {choices.map((option: any, optionIdx: number) => (
                                <Listbox.Option
                                    key={optionIdx}
                                    className={({ active }) =>
                                        `${active ? 'text-blue-900 bg-blue-50' : 'text-gray-900'}
                            cursor-default select-none relative py-2 text-lg`
                                    }
                                    value={option}
                                >
                                    {({ selected, active }) => (
                                        <>
                                            <span title={option.value[0].toUpperCase() + option.value.slice(1)}
                                                className={`${selected ? 'font-medium text-theme' : 'font-normal text-gray-900'
                                                    } block truncate text-lg text-gray-900`}
                                            >
                                                {iconMap ? iconMap[option.value].icon : option.value}
                                            </span>
                                            {selected ? (
                                                <span
                                                    className={`${active ? 'text-theme' : 'text-theme'
                                                        }
                                  absolute inset-y-0 left-0 flex items-center pl-3 text-lg`}
                                                >
                                                    <CheckIcon className="w-5 h-5" aria-hidden="true" />
                                                </span>
                                            ) : null}
                                        </>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox>
        </div>
    )
}