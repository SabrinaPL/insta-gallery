/**
 * @author Sabrina Prichard-Lybeck <sp223kz@student.lnu.se>
 *
 * @version 1.0.0
 */
const template = document.createElement('template')
template.innerHTML = `
    <div id="photo-editor-modal" class="hide-transition">
      <div id="photo-editor-container">
        <div id="choice-menu-container">
          <form id="filter-image-form">
            <div id="exit-button-container">
              <button id="exit-button">X</button>
            </div>
              <h2>Add filter effect to photo</h2>
              <p>Select the filter effect and input the filter value of the filter you wish to apply to the photo:</p>

              <input type="radio" name="filter" id="brightness" value="brightness" checked>
              <label for="brightness">Brightness</label><br>
              <input type="radio" name="filter" id="contrast" value="contrast">
              <label for="contrast">Contrast</label><br>
              <input type="radio" name="filter" id="sepia" value="sepia">
              <label for="sepia">Sepia</label><br>
              <input type="radio" name="filter" id="grayscale" value="grayscale">
              <label for="grayscale">Grayscale</label><br>
              <input type="radio" name="filter" id="opacity" value="opacity">
              <label for="opacity">Opacity</label><br>
              <input type="radio" name="filter" id="saturate" value="saturate">
              <label for="saturate">Saturation</label><br>
              <input type="radio" name="filter" id="blur" value="blur">
              <label for="blur" name="filter">Blur</label><br><br>
              <label for="filterValue">Add filter value:</label>
              <input type="text" name="filterValue" id="filterValue" required> % (px for blur)<br><br>

            <div id="photo-container">
            <!-- Photo to be appended here --> 
            </div><br><br>

            <button type="submit" id="displayFilteredImageBtn">Edit</button>
        </form>
      </div>
    </div>
  
    <style>
      body {
        font-size: 1.2rem;
        text-align: center;
      }

      #photo-editor-container,
      #choice-menu-container {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: white;
        margin-top: 5%;
        margin-left: 10%;
        margin-bottom: 5%;
        margin-right: 10%;
        padding: 10px;
        border-radius: 15px;
      }

      #exit-button-container {
        display: flex;
        justify-content: flex-end;
        margin-right: 5%;
      }

      #photo-editor-modal {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 100;
      }

      .hide-transition {
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        transition: opacity 0.5s ease-in-out, visibility 0.5s ease-in-out;
      }

      .display-transition {
       opacity: 1;
       visibility: visible;
       pointer-events: all; 
       transition: opacity 0.5s ease-in-out, visibility 0.5s ease-in-out;
      }

      #photo-container img {
        width: 100%;
        display: block; 
      }

      #displayFilteredImageBtn {
        font-size: 1.2rem;
        padding: 10px;
        background-color: #305cde;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }

      #displayFilteredImageBtn:hover {
        opacity: 0.8;
      }

      #exit-button {
        font-size: 2rem;
        padding: 10px;
        color: gray;
        border: none;
        background-color: transparent;
        cursor: pointer;
      }

      #exit-button:hover {
        opacity: 0.8;
      }
    </style>`

class PhotoEditorView extends HTMLElement {
  #photoEditorModal
  #photoContainer
  #controllerOrchestratorInstance
  #photoToBeEdited
  #filterValue
  #filterValueTextField
  #filterMethod
  #editForm

  /**
   *
   * @param {InstanceType} controllerOrchestratorInstance
   */
  constructor (controllerOrchestratorInstance) {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    this.#controllerOrchestratorInstance = controllerOrchestratorInstance
  }

  connectedCallback () {
    this.#photoEditorModal = this.shadowRoot.getElementById('photo-editor-modal')
    this.#photoContainer = this.shadowRoot.getElementById('photo-container')
    const exitButton = this.shadowRoot.getElementById('exit-button')
    this.#editForm = this.shadowRoot.getElementById('filter-image-form')

    exitButton.addEventListener('click', (event) => {
      event.preventDefault()

      this.#hideModal()

      const editingModalClosed = new CustomEvent('editingModalClosed')
      window.dispatchEvent(editingModalClosed)
    })

    this.#editForm.addEventListener('submit', (event) => {
      event.preventDefault()

      this.#filterMethod = this.shadowRoot.querySelector('input[name="filter"]:checked').value
      this.#filterValue = this.shadowRoot.getElementById('filterValue').value

      try {
        this.#validateFilterValue()
      } catch (error) {
        console.error(error)
      }
    })
  }

  #validateFilterValue () {
    if (isNaN(Number(this.#filterValue))) {
      alert('Filter value needs to be a number')

      this.#editForm.reset()

      throw new Error('Invalid filter value')
    } else {
      this.#controllerOrchestratorInstance.addFilter(this.#filterMethod, this.#filterValue.toString())
      this.#controllerOrchestratorInstance.applyFilter()
    }
  }

  #hideModal () {
    this.#photoEditorModal.classList.add('hide-transition')
    this.#photoEditorModal.classList.remove('display-transition')
  }

  /**
   *
   * @param {HTMLImageElement} photo - to be edited.
   */
  displayPhotoEditorModal (photo) {
    if (!photo || !(photo instanceof HTMLImageElement)) {
      throw new Error('Valid photo is required')
    }

    this.#photoToBeEdited = photo

    this.#scrollToTop()
    this.#displayPhotoEditor()
  }

  #scrollToTop () {
    window.scrollTo(0, 1000)
  }

  #displayPhotoEditor () {
    this.#displayModal()

    this.#photoContainer.appendChild(this.#photoToBeEdited)
  }

  #displayModal () {
    this.#photoEditorModal.classList.remove('hide-transition')
    this.#photoEditorModal.classList.add('display-transition')
  }
}

customElements.define('photo-editor-view', PhotoEditorView)

export { PhotoEditorView }
