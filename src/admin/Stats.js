import { React, useState, useEffect, useRef, useContext } from 'react';
import { NavLink } from "react-router-dom";

import { useQuery } from '@tanstack/react-query';

import { statsWriteList } from '../data/api.js';

import '../css/admin.css';

function Stats() {

    const { data, isLoading, error } = useQuery({
        queryKey: ['Stats'],
        queryFn: statsWriteList,
    });

    const [statsInfo, setStatsInfo] = useState([]);
    const [sortType, setSortType] = useState('basic');
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        if (data) {
            let sortedData = [...data];

            if (sortType === 'basic') {
                sortedData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            } else if (sortType === 'views') {
                sortedData.sort((a, b) => b.views - a.views);
            } else if (sortType === 'updates') {
                sortedData.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
            }

            setStatsInfo(sortedData);

            setAnimate(false);
            setTimeout(() => setAnimate(true), 100);
        }
    }, [data, sortType]);

    const maxViews = statsInfo.length > 0 ? Math.max(...statsInfo.map(item => item.views)) : 1;

    const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: {} });

    const handleMouseEnter = (e, item) => {
        const svg = e.target.closest('svg');
        const rect = svg.getBoundingClientRect();
        const x = e.clientX - rect.left / 3;
        const y = e.clientY - rect.top;

        setTooltip({
            visible: true,
            x,
            y,
            content: item,
        });
    };

    const handleMouseMove = (e) => {
        if (tooltip.visible) {
            const svg = e.target.closest('svg');
            const rect = svg.getBoundingClientRect();
            const x = e.clientX - rect.left / 3;
            const y = e.clientY - rect.top;

            setTooltip((prevTooltip) => ({
                ...prevTooltip,
                x,
                y,
            }));
        }
    };

    const handleMouseLeave = () => {
        setTooltip({
            visible: false,
        });
    };

    return (
        <div className="admin_stats">

            <div className='admin_header'>
                <h4 className='admin_tit admin_tit_mr'>통계확인</h4>
                <div className='admin_btn_wrap'>
                    <button className={`${sortType === 'basic' ? 'active' : ''}`} onClick={() => { setSortType('basic') }}>basic</button>
                    <button className={`${sortType === 'updates' ? 'active' : ''}`} onClick={() => { setSortType('updates') }}>updates</button>
                    <button className={`${sortType === 'views' ? 'active' : ''}`} onClick={() => { setSortType('views') }}>views</button>
                </div>
            </div>

            <div className="graph scroll">
                <div className='stats_title' style={{ height: statsInfo.length * 40 }}>
                    {statsInfo.map((item, index) => (
                        <NavLink to={`/components/WriteView/${item.id}`} key={index}>
                            {item.title}
                        </NavLink>
                    ))}
                </div>
                <svg width="100%" height={statsInfo.length * 40}>
                    {statsInfo.map((item, index) => (
                        <rect
                            key={item.id}
                            x={0}
                            y={index * 40}
                            width={animate ? (item.views / maxViews) * 98 + '%' : 0}
                            height={32}
                            fill="var(--hover-color)"
                            style={{
                                transition: animate && (item.views / maxViews) * 100 > 0
                                    ? "width 0.5s ease-out"
                                    : "none",
                            }}
                            onMouseEnter={(e) => handleMouseEnter(e, item)}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        />
                    ))}
                </svg>
            </div>

            {tooltip.visible && (
                <div
                    className="stats_tooltip"
                    style={{
                        left: tooltip.x + 10,
                        top: tooltip.y + 10,
                    }}
                >
                    <div className='stats_tooltip_info'><b>Writer</b> : <span>{tooltip.content.username !== null ? tooltip.content.username : 'unknown'}</span></div>
                    <div className='stats_tooltip_info'><b>Views</b> : <span>{tooltip.content.views}</span></div>
                    <div className='stats_tooltip_info'>
                        <b>Create</b>: <span>{new Date(tooltip.content.created_at).toLocaleDateString()} {new Date(tooltip.content.created_at).toLocaleTimeString()}</span>
                    </div>
                    <div className='stats_tooltip_info'>
                        <b>Update</b>: <span>{new Date(tooltip.content.updated_at).toLocaleDateString()} {new Date(tooltip.content.updated_at).toLocaleTimeString()}</span>
                    </div>
                </div>
            )}
        </div >

    )
}

export default Stats;