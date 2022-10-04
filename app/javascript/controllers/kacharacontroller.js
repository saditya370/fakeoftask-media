import { Controller } from "@hotwired/stimulus"

  const dataResourceID = "data-resource-id";

  const dataParent = "data-parent";

  let url;

  let resourceID;


  let newPosition;


// Connects to data-controller="drag"
export default class extends Controller {
  connect() {
    console.log("INSIDE CONNECT")
  }

  dragStart(event) {
    
    resourceID = event.target.getAttribute(dataResourceID);
    url = event.target.getAttribute(data-url)
    console.log("THIS IS THE URL",url);
    event.dataTransfer.effectAllowed = 'move';

  }


  drop(event){
    event.preventDefault();
    let parentID = event.target.getAttribute(dataParent);
    const dropTarget = this.findDropTarget(event.target,parentID);
    const draggedItem = document.querySelector(`[data-resource-id= "${resourceID}"]`);
    if (draggedItem === null || dropTarget === null){
      return true;
    }
    this.setNewPosition(dropTarget,draggedItem,event);
    newPosition = [...this.element.parentElement.children].indexOf(draggedItem);
  }




  dragEnd(event) {
    event.preventDefault();
    if(resourceID == null || newPosition ===null){
      return;
    }
    let data = JSON.stringify({
      resource: {
        id: resourceID,
        position: newPosition
      }
    }
    
    )
    console.log("THIS IS THE URL",url);
    console.log("THIS IS DATA",data);



    fetch(url,{
      method: "PATCH",
      credentials: "same-origin",
      headers: {
        "X-CSRF-Token": this.getMetaValue("csrf-token"),
        "Content-type": "application/json",
      },
      body: data,
    });



  }




  dragOver(event){
    event.preventDefault();
    return true;


  }



  dragEnter(event) {
    event.preventDefault();


  }
  getMetaValue(name) {
    const element = document.head.querySelector(`meta[name="${name}"]`);
    return element.getAttribute("content");
  }

  
  findDropTarget(target, parentID){
    if(target === null) {
      return null;
    }
    if(target.id === parentID) {
      return null;
    }
    if (target.classList.contains("draggable"))
    {
      return target;
    }
    return this.findDropTarget(target.parentElement,parentID)
  }



setNewPosition(dropTarget,draggedItem){
  const positionComparison = dropTarget.compareDocumentPosition(draggedItem);
if(positionComparison & Node.DOCUMENT_POSITION_FOLLOWING){
dropTarget.insertAdjacentElement("beforebegin",draggedItem);

} else if(positionComparison & Node.DOCUMENT_POSITION_PRECEDING) {

  dropTarget.insertAdjacentElement("afterend",draggedItem);

}

}

}
