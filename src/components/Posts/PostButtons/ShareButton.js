const ShareButton = () => {

    const shareButtonFunction = () => {
        const url = window.location.href
        navigator.clipboard.writeText(url)
    }

    return (
        <div className="post-share-button" onClick={shareButtonFunction}>
            <img className="post-share-button-image" src={/**/} />
            <div className="post-share-button-pop-up">Link Copied!</div>
        </div>
    )
}

export { ShareButton }