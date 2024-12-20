declare namespace NodeJS {
    interface ProcessEnv {
        REACT_APP_APP_A_HOST: string;
        REACT_APP_APP_B_HOST: string;
        REACT_APP_APP_C_HOST: string;
        REACT_APP_GRAFANA_HOST: string;
        NODE_ENV?: string;
    }
}