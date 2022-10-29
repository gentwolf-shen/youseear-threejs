class App {

    constructor() {
        // WebAR 内容节点
        this.container = document.querySelector('#container');

        // threejs相关的初始化
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera();
        this.camera.aspect = container.clientWidth / container.clientHeight;
        this.camera.matrixAutoUpdate = false;
        this.scene.add(this.camera);

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.domElement.setAttribute('style', 'position:absolute;top:0;left:0;display:block;z-index:100;width:100%;height:100%;object-fit:cover');
        this.container.appendChild(this.renderer.domElement);

        this.clock = new THREE.Clock();
        this.mixers = [];

        this.loadContainer = document.querySelector('#load-container');
    }

    run() {
        this.addLight();
        this.render();

        // 添加WebAR处理
        this.addWebAR();

        this.loadModel();
    }

    addLight() {
        const light = new THREE.AmbientLight(0xFFFFFF, 1.5);
        this.scene.add(light);
    }

    addWebAR() {
        this.addContainer();
        this.addYouSeeAR();
    }

    /**
     * WebAR内容的父节点
     */
    addContainer() {
        // 跟踪内容的根节点　
        this.root = new THREE.Object3D();
        this.root.matrixAutoUpdate = false;
        this.root.visible = false;
        this.scene.add(this.root);

        // anchor是跟随目标的节点，把需要跟随的模型添加到这个节点上就可以
        this.anchor = new THREE.Group();
        this.root.add(this.anchor);
    }

    /**
     * 初始化YouSeeAR
     */
    addYouSeeAR() {
        // container: WebAR内容节点
        this.youSeeAR = new YouSeeAR({ container: this.container });

        const loadWebAR = this.addLoading('YouSeeAR初始化...');
        // WebAR初始化完成事件
        this.youSeeAR.on('Ready', (m) => {
            loadWebAR.remove();

            // 设置AR相机transform
            this.camera.projectionMatrix.elements = m;
            this.camera.updateProjectionMatrix();

            // 加载特征数据，特征数据的生成请访问 www.YouSeeAR.com
            this.loadMarker = this.addLoading('特征数据加载...');
            this.youSeeAR.loadMarker('../../../features/feature.dat');
        });

        // 域名验证状态事件
        this.youSeeAR.on('License', (status) => {
            console.info(`域名验证${status ? '' : '未'}通过`);
            if (!status) {
                this.youSeeAR.pause();
            }
        });

        // 特征数据加载事件
        this.youSeeAR.on('MarkerLoad', (markers) => {
            this.loadMarker.remove();

            // markers为数组，当前版本仅支持一个跟踪目标
            // 设置anchor在容器中居中
            this.anchor.position.x = markers[0].x;
            this.anchor.position.y = markers[0].y;

            // 特征数据加载完成后，开始跟踪
            this.youSeeAR.start();
        });

        // 特征数据加载错误事件
        this.youSeeAR.on('MarkerLoadError', (err) => {
            this.loadMarker.remove();

            console.info(err);
        });

        // 识别到目标事件，当前版本仅支持一个跟踪目标
        this.youSeeAR.on('TargetFound', (i) => {
            // 识别到目标后，设置为可视状态
            this.root.visible = true;
            console.info(`found ${i}`);
        });

        // 目标丢失事件
        this.youSeeAR.on('TargetLost', (i) => {
            // 目标丢失后，设置为不可视状态
            // this.root.visible = false;
            console.info(`lost ${i}`);
        });

        // 跟踪事件，更新根节点的transform
        this.youSeeAR.on('TargetTracking', (m) => {
            this.root.matrix.elements = m;
        });

        // 打开相机，如果成功表示YouSeeAR的初始化完成
        this.youSeeAR.camera().then(() => {
        }).catch(err => {
            console.info(err);
        });
    }

    render() {
        this.renderer.setAnimationLoop(() => {
            this.renderer.render(this.scene, this.camera);

            this.mixers.forEach(i => i.update(this.clock.getDelta()));
        });
    }

    loadModel() {
        const url = 'assets/models/dancing-girl.glb';
        const loader = this.getLoader(url);
        if (loader == null) {
            return;
        }

        this.loadingModel = this.addLoading('模型加载...');

        loader.load(url, (obj) => {
            const player = obj.scene || obj;

            // 设置模型tramsform
            player.scale.setScalar(160);
            player.rotation.x = 270;
            player.position.y = -60;

            if (obj.animations.length > 0) {
                const mixer = new THREE.AnimationMixer(player);
                mixer.clipAction(obj.animations[0]).play();
                this.mixers.push(mixer);
            }

            // 将模型添加到跟踪的节点中
            this.anchor.add(player);

            this.loadingModel.remove();
        }, (progress) => {
            // 模型加载进度
            // console.info(progress);
        }, (err) => {
            console.error('加载模型错误:', err);
            this.loadingModel.remove();
        });
    }

    /**
     * 获取模型加载器
     * @param url 
     * @returns 
     */
    getLoader(url) {
        let loader = null;
        const suffix = url.split('.').pop()?.toUpperCase();
        switch (suffix) {
            case 'GLB':
            case 'GLTF':
                loader = new THREE.GLTFLoader();
                break;
            default:
                alert(`请扩展${suffix}文件加载器`);
        }
        return loader;
    }

    addLoading(msg) {
        const el = document.createElement('div');
        el.setAttribute('class', 'load-item');
        el.innerHTML = msg;
        this.loadContainer.appendChild(el);
        return el;
    }
}

const app = new App();
app.run();
