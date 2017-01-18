import React, { Component } from 'react';
import { render } from 'react-dom';

import D3LineChart from './line-chart.js';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 0
        };
    }

    changeTab = (selectedTab) => {
        this.setState({
            selectedTab
        });
    }

    render = () => {
        let selectedContent = null;
        switch(this.state.selectedTab) {
            case 0: {
                break;
            }
            case 1: {
                selectedContent = <ReportTab />;
                break;
            }
            case 2: {
                break;
            }
            case 3: {
                break;
            }
            default: {
                break;
            }
        }

        return (
            <div>
                <Header />
                <TabSelector
                    selectedTab={this.state.selectedTab}
                    selectTab={this.changeTab}
                />
                <div className='body-content'>
                    {selectedContent}
                </div>
            </div>
        );
    }
}

const Header = () => {
    return (
        <div className='header'>
            <div className='header-left'>Welcome, James.</div>
        </div>
    );
};

const TabSelector = ({ selectedTab, selectTab }) => {
    const tabs = ["Profile", "Report", "Alert History", "Help"];
    return (
        <div className='tab-area'>
            {tabs.map((tab, index) => {
                let separator = null;
                if(index !== tabs.length - 1) {
                    separator = <div className='vertical-separator'></div>;
                }
                return (
                    selectedTab === index ?
                        <span className='tab-item' key={tab}>{tab}{separator}</span>
                    :   <a className='tab-item' key={tab} onClick={selectTab.bind(null, index)} href='#'>{tab}{separator}</a>
                );
            })}
        </div>
    );
};
TabSelector.propTypes = {
    selectedTab: React.PropTypes.number,
    selectTab: React.PropTypes.func
};

const ReportTab = () => {
    return (
        <div>
            <div className='calendar'>November 2016</div>
            <div className='date-range-row'>
                Start: <input type='date' />
                End: <input type='date' />
            </div>
            <button className='button'>Report</button>
            <div className='results-area'>
                Results:
                <D3LineChart
                    data={[
                        { year: 2011, amount: 100 },
                        { year: 2012, amount: 120 },
                        { year: 2013, amount: 110 },
                        { year: 2014, amount: 123 }
                    ]}
                />
            </div>
        </div>
    );
};

export default App;
