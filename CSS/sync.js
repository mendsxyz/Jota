const sync = {
    /* Root child components */
    gridPageLayout: document.querySelector(".grid-layout-container"),
    
    /* Basic Functions */
    syncSidebarRoutelinksToRoutes(){
        const routes = Array.from(document.querySelectorAll("route.route"));
        const sideBarRoutelinks = Array.from(document.querySelectorAll(".sidebar-routelink"));
        
        sideBarRoutelinks.forEach((routelink, index) => {
            routelink.addEventListener("click", () => {
                routes.forEach(route => {
                    route.classList.remove("route-active");
                });
                sideBarRoutelinks.forEach(routelinkbtn => {
                    routelinkbtn.classList.remove("routelink-active");
                });
            
                routes[index].classList.add("route-active");
                sideBarRoutelinks[index].classList.add("routelink-active");
            });
        });
    },
    
    syncSidebarTogglerToSidebar(){
        const gridCont = sync.gridPageLayout;
        const sideBar = document.querySelector("sidebar");
        const sideBarToggler = document.querySelector(".sidebar-toggler");
        sideBarToggler.addEventListener("click", () => {
            if(gridCont.classList.contains("sidebar-shown")){
                gridCont.classList.remove("sidebar-shown");
            }else{
                gridCont.classList.add("sidebar-shown");
            }
        });
    },
    
    _buildSync(){
        sync.syncSidebarRoutelinksToRoutes();
        sync.syncSidebarTogglerToSidebar();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    sync._buildSync();
});