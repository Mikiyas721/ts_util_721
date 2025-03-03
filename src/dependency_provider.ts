/**
 * A class for registering a dependency in the DependencyProvider class
 * */
type Dependency<T> = {
    instance?: T,
    factory?: () => T
}

/**
 * A class used to create a global dependency manager
 * */
export class DependencyProvider {
    private static instance: DependencyProvider;
    private registry: { [instanceName: string]: Dependency<any> } = {}

    private constructor() {
    }

    /**
     * Makes sure that the dependencies class is instantiated only once(Singleton)
     * */
    public static get getInstance(): DependencyProvider {
        if (!DependencyProvider.instance) {
            DependencyProvider.instance = new DependencyProvider();
        }
        return DependencyProvider.instance;
    }

    getOr<T>(instanceName: string): Dependency<T> | undefined {
        return this.registry[instanceName];
    }

    /**
     * Used to find an instance from the list of dependencies using the instanceName
     * */
    get<T>(key: string): T {
        const foundInstance = this.getOr<T>(key);
        if (!foundInstance)
            throw Error(`Unable to get instance of name ${key}`);
        if (!foundInstance.instance) {
            if (!foundInstance.factory) {
                throw Error(`Unable to create instance ${key}. Missing factory`);
            }
            foundInstance.instance = foundInstance.factory();
        }
        return foundInstance.instance;
    }

    /**
     * Used to add a singleton in the dependency provider
     * */
    registerSingleton<T>(key: string, instance: T): void {
        if (typeof instance == "function") {
            console.warn(`Instance of name ${key} is not expected to be a function in function 'registerSingleton'. ` +
                "Please make sure this is intentional.");
        }
        const previouslyRegisteredInstance = this.getOr<T>(key);
        if (previouslyRegisteredInstance)
            throw Error(`Instance with key ${key} has already been registered`);

        this.registry[key] = {instance};
    }

    registerSingletons(singletons: { key: string, instance: any }[]) {
        singletons.forEach(singleton => {
            this.registerSingleton(singleton.key, singleton.instance)
        })
    }

    /**
     * Used to add a singleton factory in the dependency provider
     * */
    registerLazySingleton<T>(key: string, factory: () => T): void {
        const previouslyRegisteredInstance = this.getOr<T>(key);
        if (previouslyRegisteredInstance)
            throw Error(`Instance with key ${key} has already been registered`);

        this.registry[key] = {factory};
    }

    registerLazySingletons(singletons: { key: string, factory: () => any }[]) {
        singletons.forEach(singleton => {
            this.registerLazySingleton(singleton.key, singleton.factory)
        })
    }

    /**
     * Used to replace the registered singleton with the instance parameter
     * */
    resetSingleton<T>(key: string, instance: T): void {
        const previouslyRegisteredInstance = this.getOr<T>(key);
        if (!previouslyRegisteredInstance)
            throw Error(`Unable to reset singleton. No singleton with name ${key} found.`);
        previouslyRegisteredInstance.instance = instance;
    }

    /**
     * Used to remove the instance of a dependency
     * */
    resetLazySingleton<T>(key: string) {
        let previouslyRegisteredInstance = this.getOr<T>(key);
        if (!previouslyRegisteredInstance)
            throw Error(`Unable to queue lazy singleton for reset. No singleton with the name ${key} found.`);
        previouslyRegisteredInstance = {
            factory: previouslyRegisteredInstance.factory
        }
    }
}

/**
 * Can be used if nesting of objects by using a keys that are separated by a dot
 * */
/*const getInstanceBySubKey = <T>(key: string, instance: T) => {
    const keys = key.split(".")
    let newInstance = {}
    for (let i = keys.length - 1; i > 0; i--) {
        if(i == keys.length - 1){
            newInstance[`${keys[i]}`] = {instance}
        }else{
            let outerInstance = {}
            outerInstance[`${keys[i]}`] = newInstance
            newInstance = outerInstance
        }
    }
    return newInstance
}*/
