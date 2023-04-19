import './Home.scss';
import React, {useState, useEffect, useRef
// ,Suspense
} from 'react';

//Popups
import UploadResourcePopup from '../../Components/Popup/UploadResourcePopup/UploadResourcePopup';
import ActionPopup from '../../Components/Popup/ActionPopup/ActionPopup';
import AddNewHostPopup from '../../Components/Popup/AddNewHostPopup/AddNewHostPopup';
import AddNewHostFromServiceRegistryPopup from '../../Components/Popup/AddNewHostFromServiceRegistryPopup/AddNewHostFromServiceRegistryPopup';
import GetFilePopup from '../../Components/Popup/GetFilePopup/GetFilePopup';
import ProcessOverviewPopup from '../../Components/Popup/ProcessOverviewPopup/ProcessOverviewPopup';
import ShadowPopup from '../../Components/Popup/ShadowPopup/ShadowPopup';

//Components
import Topbar from '../../Components/Topbar/Topbar';
import Sidebar from '../../Components/Sidebar/Sidebar';
import SidebarHosts from '../../Components/SidebarHosts/SidebarHosts';
import Visualizations from '../../Components/Visualizations/Visualizations';
import { getFileLocal } from '../../Store/LocalDataStore';
// import ReactHtmlParser from 'react-html-parser';
import { getFileDynamic, getFileResourceId } from '../../Utils/FileUnpackHelper';
import {pingMinerProcessInterval} from '../../config';
import UploadManualChangesPopup from '../../Components/Popup/UploadManualChangesPopup/UploadManualChangesPopup';


// import ReactDOMServer from 'react-dom/server'

function Home(props) {

    const {
        toggles,
        isOpen,
        set,
        addHost,
        removeHost,
        getAndAddFile,
        deleteFile,
        updateComponents,
        shouldSetFileContent,
        saveFileAndUpdate,
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [popupProps, setPopupProps] = useState({});
    const [visualizationsFile, setVisualizationsFile] = useState(null);
    let updateFileInterval = useRef(null);

    const updateFile = (file) => {
        if(updateFileInterval.current !== null) clearInterval(updateFileInterval.current);
        if(getFileDynamic(file)) {
            updateFileInterval.current = setInterval(() => {
                if(getFileResourceId(file)) {
                    const newfile = getFileLocal(getFileResourceId(file));
                    setVisualizationsFile(newfile);
                } else {
                    clearInterval(updateFileInterval.current);
                }
            }, pingMinerProcessInterval);
        }
    }

    const popups = {
        AddNewHostPopup: 'AddNewHostPopup',
        AddFilePopup: 'AddFilePopup',
        ActionPopup: 'ActionPopup',
        NewSRHostPopup: 'NewSRHostPopup',
        GetFilePopup: 'GetFilePopup',
        ProcessOverviewPopup: 'ProcessOverviewPopup',
        UploadManualChangesPopup: 'UploadManualChangesPopup',
        ShadowPopup: 'ShadowPopup',
    }
    
    const openPopup = (popup, props = {}) => {
        switch(popup){
            case 'AddNewHostPopup': 
                set.setNewHostPopupOpen(true); 
                setPopupProps(props);
                break;
            case 'AddFilePopup': 
                set.setFilePopupOpen(true); 
                setPopupProps(props);
                break;
            case 'ActionPopup': 
                set.setActionPopupOpen(true); 
                setPopupProps(props);
                break;
            case 'NewSRHostPopup': 
                set.setNewHostFromSRPopupOpen(true); 
                setPopupProps(props);
                break;
            case 'GetFilePopup':
                set.setGetFilePopupOpen(true);
                setPopupProps(props);
                break;
            case 'ProcessOverviewPopup':
                set.setProcessOverviewPopupOpen(true);
                setPopupProps(props);
                break;
            case 'UploadManualChangesPopup':
                set.setUploadManualChangesPopup(true);
                setPopupProps(props);
                break;
            case 'ShadowPopup':
                set.setShadowPopupOpen(true);
                setPopupProps(props);
                break;
            default: (() => {})(); break; // Do nothing. Produces empty lambda expression call
        }
    }

    const closePopup = (popup) => {
        switch(popup){
            case 'AddNewHostPopup': 
                set.setNewHostPopupOpen(false);
                break;
            case 'AddFilePopup': 
                set.setFilePopupOpen(false);
                break;
            case 'ActionPopup': 
                set.setActionPopupOpen(false);
                break;
            case 'NewSRHostPopup': 
                set.setNewHostFromSRPopupOpen(false);
                break;
            case 'GetFilePopup':
                set.setGetFilePopupOpen(false);
                break;
            case 'ProcessOverviewPopup':
                set.setProcessOverviewPopupOpen(false);
                break;  
            case 'UploadManualChangesPopup':
                set.setUploadManualChangesPopupOpen(false);
                break;
            case 'ShadowPopup':
                set.setShadowPopupOpen(false);
                break;
            default: (() => {})(); break; // Do nothing. Produces empty lambda expression call
        }
    }

    const selectFileForVisualization = (fileId) => {
        if(fileId === null || fileId === undefined) {
            setVisualizationsFile(null);
            return;
        }
        const file = getFileLocal(fileId)
        setVisualizationsFile(file);
        if(updateComponents.Visualizations) {
            updateComponents.Visualizations.update();
        }
        updateFile(file);
    }

    

    // const [htmlString, setHtmlString] = useState(null); 

    useEffect(() => {
        setIsLoading(false);

        // const tb = <Topbar/>;
        // console.log(tb);
        // setHtmlString(ReactDOMServer.renderToString(tb));
        // // console.log(htmlString);

    }, []);

    if(isLoading){
        return (
            <div className="Home">
                <div>Loading ...</div>
            </div>
        )
    }
    
    // const htmlString = ReactDOMServer.renderToString(
    //         <Topbar toggleSidebar = {toggles.toggleSidebar}
    //         toggleSidebarHosts = {toggles.toggleSidebarHosts}
    //         sidebarOpen = {isOpen.sidebarOpen}
    //         sidebarHostsOpen = {isOpen.sidebarHostsOpen}
    //         />
    //     )
    // console.log(htmlString);

    // const ProfilePage = React.lazy(() => import(/* webpackIgnore: true */ htmlString));

    return (
        <div className="Home">
            <div className='Home-PageLayout'>
                <div className='Home-Topbar'>
                    <Topbar
                        toggleSidebar = {toggles.toggleSidebar}
                        toggleSidebarHosts = {toggles.toggleSidebarHosts}
                        sidebarOpen = {isOpen.sidebarOpen}
                        sidebarHostsOpen = {isOpen.sidebarHostsOpen}
                    />
                    {/* <div> { ReactHtmlParser(htmlString) } </div> */}
                </div>
                <div className={`Home-Page-below-topbar`}>
                    <div className={`Home-Sidebar Home-Sidebar${isOpen.sidebarOpen ? "-sidebaropen" : "-sidebarclosed"}`}>
                        <Sidebar
                            openPopup = {openPopup}
                            popups = {popups}
                            deleteFile = {deleteFile}
                            selectFileForVisualization = {selectFileForVisualization}
                            shouldSetFileContent = {shouldSetFileContent}
                            setComponentUpdaterFunction = {set.setComponentUpdaterFunction}
                            selectedFile = {visualizationsFile}
                        />
                    </div>

                    {visualizationsFile && 
                        <div className={`Home-Content-visualizations-container Home-Content-visualizations-container${isOpen.sidebarOpen ? "-sidebaropen" : "-sidebarclosed"}`}>
                            <Visualizations
                                file = {visualizationsFile}
                                setComponentUpdaterFunction = {set.setComponentUpdaterFunction}
                                getAndAddFile = {getAndAddFile}
                                openPopup = {openPopup}
                                popups = {popups}
                            />
                        </div>
                        
                    }
                </div>

                <div className={`Home-SidebarHosts Home-SidebarHosts${isOpen.sidebarHostsOpen ? "-sidebarHostsopen" : "-sidebarHostsclosed"}`}>
                    <SidebarHosts
                        toggleSidebarHosts = {toggles.toggleSidebarHosts}
                        openPopup = {openPopup}
                        popups = {popups}
                        addHost = {addHost}
                        removeHost = {removeHost}
                        setComponentUpdaterFunction = {set.setComponentUpdaterFunction}
                    />
                </div>

                {isOpen.filePopupOpen ?
                    <UploadResourcePopup
                        toggleFilePopupOpen = {toggles.toggleFilePopupOpen}
                        {...popupProps}
                        closePopup = {closePopup}
                        popups = {popups}
                        getAndAddFile = {getAndAddFile}
                    />
                    : null
                }

                {isOpen.actionPopupOpen ?
                    <ActionPopup
                        toggleActionPopupOpen = {toggles.toggleActionPopupOpen}
                        {...popupProps}
                        closePopup = {closePopup}
                        popups = {popups}
                    />
                    : null
                }

                {isOpen.newHostPopupOpen ? 
                    <AddNewHostPopup
                        toggleNewHostPopupOpen = {toggles.toggleNewHostPopupOpen}
                        {...popupProps}
                        closePopup = {closePopup}
                        popups = {popups}
                        addHost = {addHost}
                    />
                    : null
                }

                {isOpen.newHostFromSROpen ? 
                    <AddNewHostFromServiceRegistryPopup
                        togglenewHostFromSRPopupOpen = {toggles.togglenewHostFromSRPopupOpen}
                        {...popupProps}
                        closePopup = {closePopup}
                        popups = {popups}
                        addHost = {addHost}
                    />
                    : null
                }

                {isOpen.GetFilePopupOpen ? 
                    <GetFilePopup
                        toggleGetFilePopupOpen = {toggles.toggleGetFilePopupOpen}
                        {...popupProps}
                        closePopup = {closePopup}
                        popups = {popups}
                        getAndAddFile = {getAndAddFile}
                    />
                    : null
                }

                {isOpen.processOverviewPopupOpen ?
                    <ProcessOverviewPopup
                        toggleProcessOverviewPopupOpen = {toggles.toggleProcessOverviewPopupOpen}
                        {...popupProps}
                        closePopup = {closePopup}
                        popups = {popups}
                        setComponentUpdaterFunction = {set.setComponentUpdaterFunction}
                    />
                    : null
                }

                {isOpen.uploadManualChangesPopup ? 
                    <UploadManualChangesPopup
                        toggleUploadManualChangesPopup = {toggles.toggleUploadManualChangesPopup}
                        {...popupProps}
                        closePopup = {closePopup}
                        popups = {popups}
                        getAndAddFile = {getAndAddFile}
                        saveFileAndUpdate = {saveFileAndUpdate}
                    />
                    : null
                }

                {isOpen.shadowPopupOpen ?
                    <ShadowPopup
                        toggleShadowPopupOpen = {toggles.toggleShadowPopupOpen}
                        {...popupProps}
                        closePopup = {closePopup}
                        popups = {popups}
                        addHost = {addHost}
                    />
                    : null
                }
            
            </div>
        </div>
    );
}

export default Home;
