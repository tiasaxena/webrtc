import React from 'react'

const SubmitButton = ({ handleSubmitButton }) => {
  return (
    <div className='login-page_button_container'>
        <button
        onClick={ handleSubmitButton }
        className='login-page_button background_main_color text_main_color'
        >
            Start using VideoTalker
        </button>
    </div>
  )
}

export default SubmitButton