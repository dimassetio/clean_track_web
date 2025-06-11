import React from 'react'
import { FaSpinner } from 'react-icons/fa'

const Loading = () => {
  return (
    <div className="flex justify-center items-center bg-white">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500 border-opacity-70"></div>
    </div>
  )
}

export const LoadingSpinner = () => {
  return (
    <FaSpinner className="animate-spin text-primary-3 text-2xl" />
  )
}

export default Loading
