import { GetterTree, CommitOptions, MutationTree, Dispatch, DispatchOptions, Store, ActionTree } from 'vuex';

declare type Not<T, M> = T extends M ? never : T;
declare type StoreParameter<T extends () => any> = Parameters<T>[1] extends undefined ? never : Parameters<T>[1] extends NonNullable<Parameters<T>[1]> ? Parameters<T>[1] : Parameters<T>[1] | undefined;
declare type MergedFunctionProcessor<T extends () => any, O> = Parameters<T>[1] extends undefined ? (options?: O) => ReturnType<T> : Parameters<T>[1] extends NonNullable<Parameters<T>[1]> ? (payload: Parameters<T>[1], options?: O) => ReturnType<T> : (payload?: Parameters<T>[1], options?: O) => ReturnType<T>;

declare type StateObject = Not<Record<string, any>, Function>;
declare type StateFunction = Not<() => unknown | any, Record<string, any>>;
declare type State = StateObject | StateFunction;
declare type StateType<T extends State> = T extends () => any ? ReturnType<T> : T;

declare type GettersTransformer<T extends Record<string, any>> = Readonly<{
    [P in keyof T]: ReturnType<T[P]>;
}>;
declare const getterTree: <S extends Record<string, any>, T extends GetterTree<StateType<S>, any>>(_state: S, tree: T) => T;

declare type MutationsTransformer<T extends Record<string, any>> = {
    [P in keyof T]: MergedFunctionProcessor<T[P], CommitOptions>;
};
interface Commit<T extends Record<string, () => any>> {
    <P extends keyof T>(mutation: P, payload: StoreParameter<T[P]>, options?: CommitOptions): ReturnType<T[P]>;
    <P extends keyof T>(mutation: StoreParameter<T[P]> extends never ? P : never, options?: CommitOptions): ReturnType<T[P]>;
}
declare const mutationTree: <S extends Record<string, any>, T extends MutationTree<StateType<S>>>(_state: S, tree: T) => T;

declare type NuxtModules = Record<string, Partial<NuxtStore>>;
declare type ModuleTransformer<T, O = string> = T extends NuxtModules ? {
    [P in keyof T]: MergedStoreType<T[P] & BlankStore, O>;
} : {};

declare type RootStateHelper<T extends Required<NuxtStore>> = StateType<T['state']> & ModuleTransformer<T['modules'], 'state'>;
declare type RootGettersHelper<T extends Required<NuxtStore>> = GettersTransformer<T['getters']> & ModuleTransformer<T['modules'], 'getters'>;
declare type ActionContext<T extends Required<NuxtStore>> = {
    state: StateType<T['state']>;
    getters: {
        [P in keyof T['getters']]: ReturnType<T['getters'][P]>;
    };
    commit: Commit<T['mutations']>;
    dispatch: Dispatch;
    rootState: any;
    rootGetters: any;
};
declare type ActionTransformer<T extends Record<string, any>> = {
    [P in keyof T]: MergedFunctionProcessor<T[P], DispatchOptions>;
};
interface ActionHandler<T extends NuxtStore> {
    (this: Store<StateType<T['state']>>, injectee: ActionContext<T>, payload?: any): any;
}
interface ModifiedActionTree<T extends NuxtStore> {
    [key: string]: ActionHandler<T>;
}
interface NormalisedActionHandler<T extends ActionHandler<any>> {
    (this: Store<any>, ...args: Parameters<T>): ReturnType<T>;
}
declare type NormalisedActionTree<T extends ModifiedActionTree<any>> = {
    [P in keyof T]: NormalisedActionHandler<T[P]>;
};
declare const actionTree: <S extends Record<string, any>, G extends GetterTree<StateType<S>, any>, M extends MutationTree<StateType<S>>, T extends ModifiedActionTree<Required<NuxtStoreInput<S, G, M, {}, {}>>>>(_store: NuxtStoreInput<S, G, M, {}, {}>, tree: T) => NormalisedActionTree<T>;

interface BlankStore {
    state: {};
    getters: {};
    mutations: {};
    actions: {};
    modules: {};
    namespaced: boolean;
    strict: boolean;
}
interface NuxtStore {
    state: State;
    getters: Record<string, any>;
    mutations: Record<string, any>;
    actions: Record<string, any>;
    modules: NuxtModules;
    namespaced: boolean;
    strict: boolean;
}
interface NuxtStoreInput<T extends State, G, M, A, S extends {
    [key: string]: Partial<NuxtStore>;
}> {
    strict?: boolean;
    namespaced?: boolean;
    state: T;
    getters?: G;
    mutations?: M;
    actions?: A;
    modules?: S;
}
declare type MergedStoreType<T extends NuxtStore, K = string> = ('state' extends K ? StateType<T['state']> : {}) & ('getters' extends K ? GettersTransformer<T['getters']> : {}) & ('mutations' extends K ? MutationsTransformer<T['mutations']> : {}) & ('actions' extends K ? ActionTransformer<T['actions']> : {}) & ('modules' extends K ? ModuleTransformer<T['modules']> : {});
declare const getStoreType: <T extends Record<string, any>, G, M, A, S extends NuxtModules>(store: NuxtStoreInput<T, G, M, A, S>) => {
    actionContext: ActionContext<NuxtStoreInput<T, G, M, A, S> & BlankStore>;
    rootState: RootStateHelper<NuxtStoreInput<T, G, M, A, S> & BlankStore>;
    rootGetters: RootGettersHelper<NuxtStoreInput<T, G, M, A, S> & BlankStore>;
    storeInstance: ActionContext<NuxtStoreInput<T, G, M, A, S> & BlankStore> & Store<StateType<T>>;
};

declare type ComputedState<T extends Record<string, any>> = {
    [K in keyof T]: T[K] extends Function ? T[K] : () => T[K];
};
interface Mapper<T extends Record<string, any>> {
    <M extends keyof T, P extends keyof T[M] = string>(prop: M, properties: P[]): ComputedState<Pick<T[M], P>>;
    <M extends keyof T, _P extends keyof T[M] = string>(prop: M | M[]): ComputedState<Pick<T, M>>;
}

declare const getAccessorType: <T extends Record<string, any>, G extends GetterTree<StateType<T>, any>, M extends MutationTree<StateType<T>>, A extends ActionTree<StateType<T>, any>, S extends NuxtModules>(store: Partial<NuxtStoreInput<T, G, M, A, S>>) => MergedStoreType<Partial<NuxtStoreInput<T, G, M, A, S>> & BlankStore, string>;
declare const useAccessor: <T extends Record<string, any>, G extends GetterTree<StateType<T>, any>, M extends MutationTree<StateType<T>>, A extends ActionTree<StateType<T>, any>, S extends NuxtModules>(store: Store<any>, input: Partial<NuxtStoreInput<T, G, M, A, S>>, namespace?: string) => MergedStoreType<Partial<NuxtStoreInput<T, G, M, A, S>> & BlankStore, string>;
declare const getAccessorFromStore: (pattern: any) => (store: Store<any>) => MergedStoreType<Partial<NuxtStoreInput<Record<string, any>, GetterTree<Record<string, any>, any>, MutationTree<Record<string, any>>, ActionTree<Record<string, any>, any>, NuxtModules>> & BlankStore, string>;

declare const createMapper: <T extends Record<string, any>>(accessor: T) => Mapper<T>;

export { ActionContext, ActionTransformer, BlankStore, Commit, ComputedState, GettersTransformer, Mapper, MergedStoreType, MutationsTransformer, NormalisedActionHandler, NuxtStore, NuxtStoreInput, RootGettersHelper, RootStateHelper, actionTree, createMapper, getAccessorFromStore, getAccessorType, getStoreType, getterTree, mutationTree, useAccessor };
