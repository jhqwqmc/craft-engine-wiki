import React, { useState } from 'react';
import styles from './Comment.module.css';

function Comment({ children, text }) {
    const [showComment, setShowComment] = useState(false);

    return (
        <span
            className={styles.commentContainer}
            onMouseEnter={() => setShowComment(true)}
            onMouseLeave={() => setShowComment(false)}
        >
      {children}
            {showComment && (
                <span className={styles.commentText}>
          {text}
        </span>
            )}
    </span>
    );
}

export default Comment;