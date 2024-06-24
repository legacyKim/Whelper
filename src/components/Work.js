import { React, useState } from 'react';

import '../css/work.css';

import imgMyon from '../img/img_myon.png';
import imgImjca from '../img/img_imjca.png';
import imgTimeedu from '../img/img_timeedu.png';
import imgPierrot from '../img/img_pierrot.png';
import imgNiceCharger from '../img/img_nicecharger.png';
import imgIIPA from '../img/img_iipa.png';
import imgVigo from '../img/img_vigo.png';
import imgGacheonUniv from '../img/img_gacheon.png';
import imgJB from '../img/img_jbplatform.png';
import imgTickl from '../img/img_tickl.png'

function Work() {

    return (
        <div className='work_list'>
            <ul className='list'>

                <li>
                    <a href="https://www.myon.world/" target="_blank">
                        <div className='img'>
                            <img src={imgMyon} alt="Timeedu" />
                            <svg stroke="#fff" fill="#fff" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path>
                            </svg>
                        </div>
                        <div className='text_box'>
                            <span>Project</span>
                            <strong>Renaissance Myon</strong>
                        </div>
                        <div className='text_box'>
                            <span>Company</span>
                            <strong>타임교육</strong>
                        </div>
                    </a>
                </li>

                <li>
                    <a href="https://www.imjca.com/" target="_blank">
                        <div className='img'>
                            <img src={imgImjca} alt="Timeedu" />
                            <svg stroke="#fff" fill="#fff" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path>
                            </svg>
                        </div>
                        <div className='text_box'>
                            <span>Project</span>
                            <strong>IMJCA 국제수학일기</strong>
                        </div>
                        <div className='text_box'>
                            <span>Company</span>
                            <strong>타임교육</strong>
                        </div>
                    </a>
                </li>

                <li>
                    <a href="https://www.t-ime.com/" target="_blank">
                        <div className='img'>
                            <img src={imgTimeedu} alt="Timeedu" />
                            <svg stroke="#fff" fill="#fff" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path>
                            </svg>
                        </div>
                        <div className='text_box'>
                            <span>Project</span>
                            <strong>타임교육 IR 홈페이지</strong>
                        </div>
                        <div className='text_box'>
                            <span>Company</span>
                            <strong>타임교육</strong>
                        </div>
                    </a>
                </li>

                <li>
                    <a href="https://tickledu.t-ime.com/" target="_blank">
                        <div className='img'>
                            <img src={imgTickl} alt="Timeedu" />
                            <svg stroke="#fff" fill="#fff" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path>
                            </svg>
                        </div>
                        <div className='text_box'>
                            <span>Project</span>
                            <strong>Tickl</strong>
                        </div>
                        <div className='text_box'>
                            <span>Company</span>
                            <strong>타임교육</strong>
                        </div>
                    </a>
                </li>

                <li>
                    <a href="https://thepierrotclub.io/" target="_blank">
                        <div className='img'>
                            <img src={imgPierrot} />
                            <svg stroke="#fff" fill="#fff" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path>
                            </svg>
                        </div>
                        <div className='text_box'>
                            <span>Project</span>
                            <strong>Pierrot Club</strong>
                        </div>
                        <div className='text_box'>
                            <span>Company</span>
                            <strong>Meta-all</strong>
                        </div>
                    </a>
                </li>

                <li>
                    <a href="http://nicecharger.co.kr/index.jsp" target="_blank">
                        <div className='img'>
                            <img src={imgNiceCharger} />
                            <svg stroke="#fff" fill="#fff" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path>
                            </svg>
                        </div>
                        <div className='text_box'>
                            <span>Project</span>
                            <strong>Nice Charger</strong>
                        </div>
                        <div className='text_box'>
                            <span>Company</span>
                            <strong>Nineone-Labs</strong>
                        </div>
                    </a>
                </li>

                <li>
                    <a href="http://iipa.kr/" target="_blank">
                        <div className='img'>
                            <img src={imgIIPA} />
                            <svg stroke="#fff" fill="#fff" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path>
                            </svg>
                        </div>
                        <div className='text_box'>
                            <span>Project</span>
                            <strong>IIPA</strong>
                        </div>
                        <div className='text_box'>
                            <span>Company</span>
                            <strong>Nineone-Labs</strong>
                        </div>
                    </a>
                </li>

                <li>
                    <a href="http://vigolab.nineonelabs.co.kr/index.php" target="_blank">
                        <div className='img'>
                            <img src={imgVigo} />
                            <svg stroke="#fff" fill="#fff" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path>
                            </svg>
                        </div>
                        <div className='text_box'>
                            <span>Project</span>
                            <strong>vigolab</strong>
                        </div>
                        <div className='text_box'>
                            <span>Company</span>
                            <strong>Nineone-Labs</strong>
                        </div>
                    </a>
                </li>

                <li>
                    <a href="http://emlab.gachon.ac.kr/" target="_blank">
                        <div className='img'>
                            <img src={imgGacheonUniv} />
                            <svg stroke="#fff" fill="#fff" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path>
                            </svg>
                        </div>
                        <div className='text_box'>
                            <span>Project</span>
                            <strong>가천대학교</strong>
                        </div>
                        <div className='text_box'>
                            <span>Company</span>
                            <strong>Nineone-Labs</strong>
                        </div>
                    </a>
                </li>

                <li>
                    <a href="https://jbbplatform.jbbank.co.kr/" target="_blank">
                        <div className='img'>
                            <img src={imgJB} />
                            <svg stroke="#fff" fill="#fff" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path>
                            </svg>
                        </div>
                        <div className='text_box'>
                            <span>Project</span>
                            <strong>전북은행 JB platform</strong>
                        </div>
                        <div className='text_box'>
                            <span>Company</span>
                            <strong>Nineone-Labs</strong>
                        </div>
                    </a>
                </li>
            </ul>
        </div>
    )
}

export default Work;