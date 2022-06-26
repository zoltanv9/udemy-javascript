class Tooltip {

    constructor(setActiveTooltipFn) {
        this.setActiveTooltipFalse = setActiveTooltipFn;
    }
    detachTooltip  = () => {
        this.tooltip.remove();
        this.setActiveTooltipFalse();
    }

    attachTooltip () {
        const tooltipElement = document.createElement('div');
        tooltipElement.className = 'card';
        tooltipElement.textContent = 'DUMMY!';
        tooltipElement.addEventListener('click', this.detachTooltip);
        this.tooltip = tooltipElement;
        document.body.append(tooltipElement);
    }

}

class ProjectItem {

    hasActiveTooltip = false;

    constructor(id, updateListFunction, type) {
        this.id = id;
        this.updateListHandler = updateListFunction;
        this.connectSwitchButton(type);
        this.connectMoreInfoButton();

/*
        this.btn = (document.getElementById(this.id)).querySelector('button:last-of-type');
        this.btn.addEventListener('click', () => console.log(this));
*/

    }

    setActive () {
        this.hasActiveTooltip = false;
    }

    connectSwitchButton (type) {
        const sectionId = document.getElementById(this.id)
        let buttonSwitch = sectionId.querySelector('button:last-of-type');
        buttonSwitch.textContent = type === 'active' ? 'Finished' : 'Activate';
        buttonSwitch = DOMHelper.clearEventListener(buttonSwitch);
        buttonSwitch.addEventListener('click',this.updateListHandler.bind(null,this.id));
    }

    update (updateProjectFn, type) {
        this.updateListHandler = updateProjectFn;
        this.connectSwitchButton(type);

    }

    connectMoreInfoButton () {
        const sectionId = document.getElementById(this.id)
        let buttonMore = sectionId.querySelector('button:first-of-type');
        buttonMore.addEventListener('click', this.showMoreInfoHandler.bind(this))
    }



    showMoreInfoHandler () {
        if (!this.hasActiveTooltip) {
            const tooltip = new Tooltip(this.setActive.bind((this)));
            tooltip.attachTooltip();
            this.hasActiveTooltip = true;
        } else {
            return;
        }
    }


}


class ProjectList {
        projects = [];

        constructor(type) {
            this.type = type;
            const prjItems = document.querySelectorAll(`#${type}-projects li`);
            for (const prjItem of prjItems) {
                this.projects.push(new ProjectItem(prjItem.id, this.switchProject.bind(this), this.type));
            }
        }

        setSwitchHandlerFunction (switchHandlerFunction) {
            this.switchHandler = switchHandlerFunction;
        }

        addProject (project) {

            this.projects.push(project);
            console.log(this);
            DOMHelper.moveElement(project.id, `#${this.type}-projects ul`);
            project.update(this.switchProject.bind(this),this.type);
        }

        switchProject (projectId) {
            this.switchHandler(this.projects.find(p => p.id === projectId));
            this.projects = this.projects.filter(p => p.id !== projectId );

        }

}

class DOMHelper {
    static moveElement (elementId, newDestinationSelector ) {
        const element = document.getElementById(elementId);
        const destinationElement = document.querySelector(newDestinationSelector);
        destinationElement.append(element);
    }

    static clearEventListener (element) {
        const clonedElement = element.cloneNode(true);
        element.replaceWith(clonedElement);
        return clonedElement;
    }
}

class App {
    static init () {
        const activeProjectList = new ProjectList('active');
        const finishedProjectList = new ProjectList('finished');

        activeProjectList.setSwitchHandlerFunction(finishedProjectList.addProject.bind(finishedProjectList));
        finishedProjectList.setSwitchHandlerFunction(activeProjectList.addProject.bind(activeProjectList));

    };
}

App.init();