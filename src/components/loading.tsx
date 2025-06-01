import React from 'react'

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500 border-opacity-70"></div>
    </div>
  )
}

export default Loading
