import { getDeleteRequestInit, getPostRequestInit, getPutRequestInit, getRequestInit, setAuthToken } from "./helper";
import { ApiResult, StatusResponse } from "./response";

/**
 * Response for the RegisterGuest API call.
 */
export interface AuthenticateResponse extends StatusResponse {
    /**
     * Id of the authorized user, or 0 otherwise.
     */
    Id: number;

    /**
     * A value indicating whether this user is guest or not.
     */
    IsGuest: boolean;

    /**
     * First name of the user.
     */
    FirstName: string;

    /**
     * Last name of the user.
     */
    LastName: string;

    /**
     * Patronymic name of the user.
     */
    PatronymicName: string;

    /**
     * Login of the user.
     */
    Login: string;

    /**
     * Money which player has in different currencies.
     */
    Money: number[];

    /**
     * Email of the user.
     */
    Email: string;

    /**
     * Country of the user.
     */
    Country: string;

    /**
     * City of the user
     */
    City: string;

    /**
     * Url of the image to display in the UI
     */
    ImageUrl: string;

    /**
     * Gets or sets additional properties for the player.
     */
    Properties: Map<string, string>;
}

export interface PersonalAccountData {
    RealMoney: number;
    RealMoneyReserve: number;
    GameMoney: number;
    GameMoneyReserve: number;

    /**
     * Amount of points
     */
    Points: number;
    LastIncomeDate: string;
    LastIncomeAmount: number;
    LastRequestNumber: number;
}

export interface PlayerDefinitionProperties {
    Language: string;
    Points: string;
    Stars: string;
}

export interface PlayerDefinition {
    Email: string;
    PhoneNumber: string;
    FirstName: string;
    LastName: string;
    RealMoney: number;
    GameMoney: number;
    Points: number;
    Properties: PlayerDefinitionProperties;
}

export interface OperationData {
    Amount: number;
    OperationDate: string;
    Operation: number;
    Comments: number;
    BookingOffice: string;
    Status: string;
}

/**
 * Response for the RegisterGuest API call.
 */
export interface RegisterGuestResponse extends StatusResponse {
    UserId: number;
    Login: string;
    Password: string;
}

export interface UserRating {
    Id: number;
    Login: string;
    Points: number;
    Stars: number;
}

export interface IAccount {
    logout(): Promise<StatusResponse>;
    authenticate(login: string, password: string, rememberMe: boolean): Promise<AuthenticateResponse>;
    activateAccount(login: string, token: string): Promise<StatusResponse>;
    cancelAccountActivation(login: string, token: string): Promise<StatusResponse>;
    changePassword(oldPassword: string, newPassword: string): Promise<StatusResponse>;
    getAccount(): Promise<ApiResult<PersonalAccountData>>;
    getPlayer(): Promise<ApiResult<PlayerDefinition>>;
    getAccountHistory(
        fromDate: string | null,
        toDate: string | null,
        fromAmount: number | null,
        toAmount: number | null,
        operationType: number | null): Promise<ApiResult<OperationData[]>>;
    registerGuest(): Promise<RegisterGuestResponse>;
    register(
        login: string,
        email: string,
        password: string,
        phoneNumber: string,
        firstName: string,
        lastName: string,
        patronymicName: string,
        country: number,
        city: string,
        additionalProperties: any): Promise<StatusResponse>;
    /**
     * Checks for ability to create user with given parameters.
     * @param login Desired login for the user.
     * @param email Desired email for the user.
     * @param phoneNumber Desired phone number for the user
     */
    registrationCheck(
        login: string,
        email: string,
        phoneNumber: string): Promise<StatusResponse>;
    requestResetPassword(login: string, email: string): Promise<StatusResponse>;
    resetPassword(token: string, newPassword: string): Promise<StatusResponse>;
    resetAvatar(): Promise<StatusResponse>;
    setAvatarUrl(url: string): Promise<StatusResponse>;
    updatePlayerProfile(
        phoneNumber: string,
        firstName: string,
        lastName: string,
        patronymicName: string,
        email: string,
        country: number,
        city: number): Promise<StatusResponse>;
    uploadAvatar(image: any): Promise<StatusResponse>;
    getBestPlayers(): Promise<ApiResult<UserRating[]>>;
}

export class Account implements IAccount {
    constructor(public host: string) {
    }
    public async logout() {
        const data = { };
        const response = await fetch(this.host + `/api/account/my/logout`, getPostRequestInit());
        const jsonData = await response.json() as StatusResponse;
        return jsonData;
    }
    public async authenticate(login: string, password: string, rememberMe: boolean) {
        const data = { Login: login, Password: password, RememberMe: rememberMe };
        const init = getPostRequestInit(data);
        init.credentials = "include";
        const response = await fetch(this.host + `/api/account/my/login`, init);
        const authToken = response.headers.get("X-Auth-Token");
        setAuthToken(authToken);
        const jsonData = await response.json() as AuthenticateResponse;
        return jsonData;
    }
    public async activateAccount(login: string, token: string) {
        const data = { Token: token };
        const response = await fetch(this.host + `/api/activations/${login}`, getPostRequestInit(data));
        const jsonData = await response.json() as StatusResponse;
        return jsonData;
    }
    public async cancelAccountActivation(login: string, token: string) {
        const data = { Token: token };
        const response = await fetch(this.host + `/api/activations/${login}`, getDeleteRequestInit(data));
        const jsonData = await response.json() as StatusResponse;
        return jsonData;
    }
    public async changePassword(oldPassword: string, newPassword: string) {
        const data = { OldPassword: oldPassword, NewPassword: newPassword };
        const response = await fetch(this.host + `/api/account/my/password`, getPostRequestInit(data));
        const jsonData = await response.json() as StatusResponse;
        return jsonData;
    }
    public async getAccount() {
        const response = await fetch(this.host + `/api/account/my`, getRequestInit());
        const jsonData = await response.json() as ApiResult<PersonalAccountData>;
        return jsonData;
    }
    public async getPlayer(): Promise<ApiResult<PlayerDefinition>> {
        const response = await fetch(this.host + `/api/account/my/detailed`, getRequestInit());
        const jsonData = await response.json() as ApiResult<PlayerDefinition>;
        return jsonData;
    }
    public async getAccountHistory(
        fromDate: string | null,
        toDate: string | null,
        fromAmount: number | null,
        toAmount: number | null,
        operationType: number | null): Promise<ApiResult<OperationData[]>> {
        const parameters: string[] = [];
        if (fromDate) {
            parameters.push(`fromDate=${fromDate}`);
        }

        if (toDate) {
            parameters.push(`toDate=${toDate}`);
        }

        if (fromAmount) {
            parameters.push(`fromAmount=${fromAmount}`);
        }

        if (toAmount) {
            parameters.push(`toAmount=${toAmount}`);
        }

        if (operationType) {
            parameters.push(`operationType=${operationType}`);
        }

        const queryString = parameters.join("&");
        const response = await fetch(this.host + `/api/account/my/history?${queryString}`, getRequestInit());
        const jsonData = await response.json() as ApiResult<OperationData[]>;
        return jsonData;
    }
    public async registerGuest(): Promise<RegisterGuestResponse> {
        const response = await fetch(this.host + `/api/registration/guests`, getPostRequestInit());
        const jsonData = await response.json() as RegisterGuestResponse;
        return jsonData;
    }
    public async register(
        login: string,
        email: string,
        password: string,
        phoneNumber: string,
        firstName: string,
        lastName: string,
        patronymicName: string,
        country: number,
        city: string,
        additionalProperties: any): Promise<StatusResponse> {
        const data = {
            additionalProperties,
            city,
            country,
            email,
            firstName,
            lastName,
            login,
            password,
            patronymicName,
            phoneNumber,
        };
        const response = await fetch(this.host + `/api/registration`, getPostRequestInit(data));
        const jsonData = await response.json() as StatusResponse;
        return jsonData;
    }
    /**
     * Checks for ability to create user with given parameters.
     * @param login Desired login for the user.
     * @param email Desired email for the user.
     * @param phoneNumber Desired phone number for the user
     */
    public async registrationCheck(
        login: string,
        email: string,
        phoneNumber: string): Promise<StatusResponse> {
        const data = {
            email,
            login,
            phoneNumber,
        };
        const response = await fetch(this.host + `/api/registration/check`, getPostRequestInit(data));
        const jsonData = await response.json() as StatusResponse;
        return jsonData;
    }
    public async requestResetPassword(login: string, email: string): Promise<StatusResponse> {
        const data = {
            email,
            login,
        };
        const response = await fetch(this.host + `/api/account/password-reset/requests`, getPostRequestInit(data));
        const jsonData = await response.json() as StatusResponse;
        return jsonData;
    }
    public async resetPassword(token: string, newPassword: string): Promise<StatusResponse> {
        const data = {
            password: newPassword,
        };
        const url = this.host + `/api/account/password-reset/requests/${token}`;
        const response = await fetch(url, getPostRequestInit(data));
        const jsonData = await response.json() as StatusResponse;
        return jsonData;
    }
    public async resetAvatar() {
        const response = await fetch(this.host + `/api/accont/avatar`, getDeleteRequestInit());
        const jsonData = await response.json() as StatusResponse;
        return jsonData;
    }
    public async setAvatarUrl(url: string) {
        const data = { url };
        const response = await fetch(this.host + `/api/accont/avatar/url`, getPutRequestInit(data));
        const jsonData = await response.json() as StatusResponse;
        return jsonData;
    }
    public async updatePlayerProfile(
        phoneNumber: string,
        firstName: string,
        lastName: string,
        patronymicName: string,
        email: string,
        country: number,
        city: number) {
        const data = { phoneNumber, firstName, lastName, patronymicName, email, country, city };
        const response = await fetch(this.host + `/api/accont/profile`, getPostRequestInit(data));
        const jsonData = await response.json() as StatusResponse;
        return jsonData;
    }
    public uploadAvatar(image: any): Promise<StatusResponse> {
        throw new Error("Not implmented.");
    }
    public async getBestPlayers(): Promise<ApiResult<UserRating[]>> {
        const response = await fetch(this.host + `/api/players/best`, getRequestInit());
        const jsonData = await response.json() as ApiResult<UserRating[]>;
        return jsonData;
    }
}
