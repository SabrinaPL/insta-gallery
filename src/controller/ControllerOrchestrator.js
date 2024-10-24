/**
 * Controller class responsible for delegating tasks to the correct controller class, create an instance of the services and dependency inject those instances to the controller classes (to avoid multiple instantiation of multiple instances).
 * 
 * @author Sabrina Prichard-Lybeck <sp223kz@student.lnu.se>
 *
 * @version 1.0.0
 */
import { PhotoGalleryController } from './PhotoGalleryController.js'
import { PhotoEditorController } from './PhotoEditorController'
import { PhotoAssistantService } from '../services/PhotoAssistantService'
import { UploadService } from '../services/UploadService.js'

export class ControllerOrchestrator {
  #photoAssistantServiceInstance
  #uploadServiceInstance
  #photoGalleryControllerInstance
  #photoEditorControllerInstance

  constructor () {
    // Control statements to avoid multiple instantiations.
    if (!this.#photoAssistantServiceInstance) {
      this.#photoAssistantServiceInstance = new PhotoAssistantService()
    } 
    
    if (!this.#uploadServiceInstance) {
      this.#uploadServiceInstance = new UploadService()   
    }

    if (!this.#photoEditorControllerInstance) {
      this.#photoEditorControllerInstance = new PhotoEditorController(this.#photoAssistantServiceInstance)
    }
  }

  constructPhotoGallery (columns, photoGalleryElement) {
    if (typeof (columns) !== 'number' || !columns || !(photoGalleryElement instanceof HTMLElement)) {
      throw new Error('Valid column value and photo gallery element are required')
    }

    this.#photoGalleryControllerInstance = new PhotoGalleryController(this.#photoAssistantServiceInstance, this.#uploadServiceInstance)
    this.#photoGalleryControllerInstance.setupPhotoGallery(columns, photoGalleryElement)
  }

  uploadPhotos () {
    this.#photoGalleryControllerInstance.uploadPhotos()
  }

  editPhoto (photo) {
   this.#photoEditorControllerInstance.addPhotoToBeFiltered(photo)
  }
}
