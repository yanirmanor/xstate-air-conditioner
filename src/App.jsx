import { useState } from 'react'
import './App.css'
import { useMachine } from '@xstate/react'
import { airConditionerMachine } from './machine'
import get from 'lodash/get'
import { FaSun, FaRegSnowflake, FaPowerOff } from 'react-icons/fa'

function App () {
  const [state, send] = useMachine(airConditionerMachine)
  const { value } = state

  // console.log(JSON.stringify(value))

  return (
    <div className='App'>
      <div
        className='m-10 p-5 rounded-lg bg-gray-100'
        data-testid='power-display'
      >
        <div className='mb-3'>Air Conditioner</div>
        {state.matches('poweredOn') && (
          <div>
            <div className='flex items-center mb-3' data-testid='mode'>
              Mode:
              {get(value, 'poweredOn.mode') === 'heat' ? (
                <FaSun className='text-xl' data-testid='mode-heat' />
              ) : (
                <FaRegSnowflake className='text-xl' data-testid='mode-snow' />
              )}
            </div>
            <div data-testid='fun'>Fun: {get(value, 'poweredOn.fun')}</div>
          </div>
        )}
      </div>
      <div className='m-10 p-3 rounded-lg bg-gray-100 border-black border-2 w-44'>
        <div className='flex items-center justify-between mb-3'>
          <div className='mr-2'>Living Room</div>
          <FaPowerOff
            data-testid='toggle-power'
            className={`text-xl cursor-pointer ${
              state.matches('poweredOff') ? 'text-red-500' : 'text-green-500'
            }`}
            onClick={() => send('TOGGLE_POWER')}
          />
        </div>
        {state.matches('poweredOn') && (
          <div className='flex flex-col m-3 pt-5'>
            <button
              className='mb-5 bg-gray-200 hover:bg-gray-400 font-bold p-5 rounded'
              data-testid='toggle-mode'
              onClick={() => send('TOGGLE_MODE')}
            >
              Cooling Mode
            </button>
            <button
              className='bg-gray-200 hover:bg-gray-400 font-bold p-5 rounded'
              data-testid='toggle-fun'
              onClick={() => send('TOGGLE_FUN')}
            >
              Fun
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
