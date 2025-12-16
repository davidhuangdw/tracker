import * as React from "react";
import {ActivityEvent} from "@/app/domains/activity/comp/ActivityCalendar/utils.tsx";
import moment from "moment";

export const ActivityEventView: React.FC<{ event: ActivityEvent }> = ({event}) => {
  const lines = ((event.title || '') as string).split('\n') || [];
  const isMultiDay = moment(event.end).diff(moment(event.start), 'days') > 0;

  return (
    <div style={{
      padding: '2px 4px',
      fontSize: '12px',
      lineHeight: '1.2',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
      overflow: 'hidden',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'start',
      ...(isMultiDay && {
        fontWeight: 'bold',
        borderLeft: '3px solid rgba(255, 255, 255, 0.7)',
        paddingLeft: '6px',
        background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, transparent 100%)'
      })
    }}>
        {lines.map((line, index) => (
          <div key={index}>
            {line}
            {index < lines.length - 1 && <br/>}
          </div>
        ))}
    </div>
  );
};

export default ActivityEventView;