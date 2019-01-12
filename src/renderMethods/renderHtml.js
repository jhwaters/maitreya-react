import React from 'react'

const renderHtml = (content) => <React.Fragment dangerouslySetInnerHtml={{__html: content}}/>

export default renderHtml