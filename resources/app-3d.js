
/*
ARSimplestExample shows how to populate the stage group that is rendered on the stage 
*/
class ARSimplestExample extends XRExampleBase {
    constructor(domElement){
        super(domElement, false)
        this._tapEventData = null // Will be filled in on touch start and used in updateStageGroup

        this.anchoredNodes = [] // { XRAnchorOffset, Three.js Object3D }

        // A message at the bottom of the screen that shows whether a surface has been found
        this._messageEl = document.createElement('div')
        this.el.appendChild(this._messageEl)
        this._messageEl.style.position = 'absolute'
        this._messageEl.style.bottom = '10px'
        this._messageEl.style.left = '10px'
        this._messageEl.style.color = 'white'
        this._messageEl.style['font-size'] = '16px'
    }

    // Called during construction to allow the app to populate this.stageGroup (a THREE.Group)
    initializeStageGroup(){
        // Add a box at the stage origin to show where the stage group is located
        let box = new THREE.Mesh(
            new THREE.BoxBufferGeometry(0.1, 0.1, 0.1),
            new THREE.MeshPhongMaterial({ color: '#DDFFDD' })
        )
        box.position.set(0, 0.05, 0)
        this.stageGroup.add(box)

        // Add a box one meter in front of stage origin to show the direction of the Z axis
        box = new THREE.Mesh(
            new THREE.BoxBufferGeometry(0.1, 0.1, 0.1),
            new THREE.MeshPhongMaterial({ color: '#FF0000' })
        )
        box.position.set(0, 0.05, -1)
        this.stageGroup.add(box)

        // Add a few lights
        this.stageGroup.add(new THREE.AmbientLight('#FFF', 0.2))
        let directionalLight = new THREE.DirectionalLight('#FFF', 0.6)
        directionalLight.position.set(0, 10, 0)
        this.stageGroup.add(directionalLight)
    }

    // Called once per frame, before render, to give the app a chance to update this.stageGroup (a THREE.Group)
    updateStageGroup(frame, stageCoordinateSystem, stagePose){
        // If we have tap data, attempt a hit test for a surface
        if(this._tapEventData !== null){
            const x = this._tapEventData[0]
            const y = this._tapEventData[1]
            this._tapEventData = null
            // Attempt a hit test using the normalized screen coordinates
            frame.findAnchor(x, y).then(anchorOffset => {
                if(anchorOffset === null){
                    this._messageEl.innerHTML = 'miss'
                } else {
                    const anchor = frame.getAnchor(anchorOffset.anchorUID)
                    if(anchor === null){
                        console.error('unknown anchor uid', anchorOffset.anchorUID)
                        return
                    }
                    this._messageEl.innerHTML = 'hit: ' + anchor.coordinates.position.join(', ')

                    // Save the XRAnchorOffset and the node so that we can update the node's position based off of the anchor
                    let anchorInfo = {
                        anchorOffset: anchorOffset,
                        node: this._createSceneGraphNode()
                    }
                    this.anchoredNodes.push(anchorInfo)

                    // Add a block to the scene to indicate the position of the XRAnchorOffset
                    // Its position will be updated below along with the other anchored nodes
                    this.stageGroup.add(anchorInfo.node)
                }
            }).catch(err => {
                console.error('Error in hit test', err)
            })
        }

        // Update anchored node positions in the scene graph using updated anchor positions
        for(let anchoredNode of this.anchoredNodes){
            const anchor = frame.getAnchor(anchoredNode.anchorOffset.anchorUID)
            if(anchor === null){
                throttledConsoleLog('Unknown anchor uid', anchoredNode.anchorOffset.anchorUID)
            } else {
                anchoredNode.node.matrixAutoUpdate = false
                let offsetCoordinates = anchoredNode.anchorOffset.getTransformedCoordinates(anchor)
                if(offsetCoordinates.coordinateSystem.type === XRCoordinateSystem.STAGE){
                    anchoredNode.node.matrix.fromArray(offsetCoordinates.poseMatrix)
                } else {
                    anchoredNode.node.matrix.fromArray(offsetCoordinates.getTransformedCoordinates(stageCoordinateSystem).poseMatrix)
                }
                anchoredNode.node.updateMatrixWorld(true)
            }
        }
    }


    // Creates a box used to indicate the location of an anchor offset
    _createSceneGraphNode(){
        let geometry = new THREE.BoxBufferGeometry(0.1, 0.1, 0.1)
        let material = new THREE.MeshPhongMaterial({ color: '#99FF99' })
        let mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(0, 0.05, 0)
        let obj = new THREE.Object3D()
        obj.add(mesh)
        return obj
    }

    // Save screen taps as normalized coordinates for use in this.updateStageGroup
    _onTap(x,y){
        console.log('tap!', x, y)
        //save screen coordinates normalized to -1..1 (0,0 is at center and 1,1 is at top right)
        this._tapEventData = [
            x / window.innerWidth,
            y / window.innerHeight
        ]
    }
}


window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        try {
            window.pageApp = new ARSimplestExample(document.getElementById('target'))
            window.touchTapHandler = window.pageApp._onTap.bind(window.pageApp);
        } catch(e) {
            console.error('page error', e)
        }
    }, 1000)
})