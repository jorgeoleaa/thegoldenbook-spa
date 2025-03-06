/* tslint:disable */
/* eslint-disable */
/**
 * The Golden Book API
 * API para negocio de venta de libros 
 *
 * The version of the OpenAPI document: 1.0
 * Contact: soporte@thegoldenbook.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import type {
  ClasificacionEdad,
  ClienteCredentials,
  ClienteDTO,
  Formato,
  GeneroLiterario,
  Idioma,
  LibroDTO,
  Pedido,
  ValoracionDTO,
} from '../models/index';
import {
    ClasificacionEdadFromJSON,
    ClasificacionEdadToJSON,
    ClienteCredentialsFromJSON,
    ClienteCredentialsToJSON,
    ClienteDTOFromJSON,
    ClienteDTOToJSON,
    FormatoFromJSON,
    FormatoToJSON,
    GeneroLiterarioFromJSON,
    GeneroLiterarioToJSON,
    IdiomaFromJSON,
    IdiomaToJSON,
    LibroDTOFromJSON,
    LibroDTOToJSON,
    PedidoFromJSON,
    PedidoToJSON,
    ValoracionDTOFromJSON,
    ValoracionDTOToJSON,
} from '../models/index';

export interface AutenticarClienteRequest {
    clienteCredentials?: ClienteCredentials;
}

export interface CreatePedidoRequest {
    pedido?: Pedido;
}

export interface CreateValoracionRequest {
    locale: string;
    valoracionDTO?: ValoracionDTO;
}

export interface DeleteClienteRequest {
    id?: number;
}

export interface DeletePedidoRequest {
    id?: number;
}

export interface DeleteValoracionRequest {
    libroId?: number;
    clienteId?: number;
}

export interface FindEdadesByLocaleRequest {
    locale?: string;
}

export interface FindFormatosByLocaleRequest {
    locale?: string;
}

export interface FindGenerosLiterariosByLocaleRequest {
    locale?: string;
}

export interface FindIdiomasByLocaleRequest {
    locale?: string;
}

export interface FindLibrosByCriteriaRequest {
    id?: number;
    nombre?: string;
    isbn?: string;
    desdePrecio?: number;
    hastaPrecio?: number;
    desdeFecha?: Date;
    hastaFecha?: Date;
    generoLiterarioId?: number;
    clasificacionEdadId?: number;
    idiomaId?: number;
    formatoId?: number;
    locale?: string;
}

export interface FindPedidosByCriteriaRequest {
    id?: number;
    fechaDesde?: string;
    fechaHasta?: string;
    precioDesde?: number;
    precioHasta?: number;
    clienteId?: number;
    tipoEstadoPedidoId?: number;
}

export interface GetExternalGrammarRequest {
    path: string;
}

export interface RegisterClienteRequest {
    clienteDTO?: ClienteDTO;
}

/**
 * 
 */
export class DefaultApi extends runtime.BaseAPI {

    /**
     * Autenticación de un cliente introduciendo su corre electrónico y su contraseña
     * Autenticación de un cliente
     */
    async autenticarClienteRaw(requestParameters: AutenticarClienteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ClienteDTO>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/cliente/autenticar`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ClienteCredentialsToJSON(requestParameters['clienteCredentials']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ClienteDTOFromJSON(jsonValue));
    }

    /**
     * Autenticación de un cliente introduciendo su corre electrónico y su contraseña
     * Autenticación de un cliente
     */
    async autenticarCliente(requestParameters: AutenticarClienteRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ClienteDTO> {
        const response = await this.autenticarClienteRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Crea un pedido introduciendo todos los datos del mismo
     * Creación de un pedido
     */
    async createPedidoRaw(requestParameters: CreatePedidoRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Pedido>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/pedido/create`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: PedidoToJSON(requestParameters['pedido']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PedidoFromJSON(jsonValue));
    }

    /**
     * Crea un pedido introduciendo todos los datos del mismo
     * Creación de un pedido
     */
    async createPedido(requestParameters: CreatePedidoRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Pedido> {
        const response = await this.createPedidoRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Crea una valoración para un libro asociada a un cliente.
     * Creación de valoración
     */
    async createValoracionRaw(requestParameters: CreateValoracionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['locale'] == null) {
            throw new runtime.RequiredError(
                'locale',
                'Required parameter "locale" was null or undefined when calling createValoracion().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/valoracion/{locale}`.replace(`{${"locale"}}`, encodeURIComponent(String(requestParameters['locale']))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ValoracionDTOToJSON(requestParameters['valoracionDTO']),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Crea una valoración para un libro asociada a un cliente.
     * Creación de valoración
     */
    async createValoracion(requestParameters: CreateValoracionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.createValoracionRaw(requestParameters, initOverrides);
    }

    /**
     * Eliminación de un cliente a partir del id que tiene en base de datos
     * Eliminación de cliente
     */
    async deleteClienteRaw(requestParameters: DeleteClienteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        if (requestParameters['id'] != null) {
            queryParameters['id'] = requestParameters['id'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/cliente/delete`,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Eliminación de un cliente a partir del id que tiene en base de datos
     * Eliminación de cliente
     */
    async deleteCliente(requestParameters: DeleteClienteRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteClienteRaw(requestParameters, initOverrides);
    }

    /**
     * Elimina un pedido a partir del identificador introducido
     * Eliminación de un pedido
     */
    async deletePedidoRaw(requestParameters: DeletePedidoRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        if (requestParameters['id'] != null) {
            queryParameters['id'] = requestParameters['id'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/pedido/delete`,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Elimina un pedido a partir del identificador introducido
     * Eliminación de un pedido
     */
    async deletePedido(requestParameters: DeletePedidoRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deletePedidoRaw(requestParameters, initOverrides);
    }

    /**
     * Elimina una valoración especificando el ID del libro asociado y el ID del cliente que la realizó.
     * Eliminar una valoración
     */
    async deleteValoracionRaw(requestParameters: DeleteValoracionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        if (requestParameters['libroId'] != null) {
            queryParameters['libroId'] = requestParameters['libroId'];
        }

        if (requestParameters['clienteId'] != null) {
            queryParameters['clienteId'] = requestParameters['clienteId'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/valoracion`,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Elimina una valoración especificando el ID del libro asociado y el ID del cliente que la realizó.
     * Eliminar una valoración
     */
    async deleteValoracion(requestParameters: DeleteValoracionRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteValoracionRaw(requestParameters, initOverrides);
    }

    /**
     * Recupera una lista de clasificaciones por edad en el idioma del locale proporcionado
     * Búsqueda de clasficaciones por edad de los libros
     */
    async findEdadesByLocaleRaw(requestParameters: FindEdadesByLocaleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<ClasificacionEdad>>> {
        const queryParameters: any = {};

        if (requestParameters['locale'] != null) {
            queryParameters['locale'] = requestParameters['locale'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/edad`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(ClasificacionEdadFromJSON));
    }

    /**
     * Recupera una lista de clasificaciones por edad en el idioma del locale proporcionado
     * Búsqueda de clasficaciones por edad de los libros
     */
    async findEdadesByLocale(requestParameters: FindEdadesByLocaleRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<ClasificacionEdad>> {
        const response = await this.findEdadesByLocaleRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Recupera una lista de formatos en el idioma del locale proporcionado
     * Búsqueda de formatos
     */
    async findFormatosByLocaleRaw(requestParameters: FindFormatosByLocaleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<Formato>>> {
        const queryParameters: any = {};

        if (requestParameters['locale'] != null) {
            queryParameters['locale'] = requestParameters['locale'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/formato`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(FormatoFromJSON));
    }

    /**
     * Recupera una lista de formatos en el idioma del locale proporcionado
     * Búsqueda de formatos
     */
    async findFormatosByLocale(requestParameters: FindFormatosByLocaleRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<Formato>> {
        const response = await this.findFormatosByLocaleRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Recupera una lista de géneros literarios en el idioma del locale proporcionado
     * Búsqueda de géneros literarios
     */
    async findGenerosLiterariosByLocaleRaw(requestParameters: FindGenerosLiterariosByLocaleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<GeneroLiterario>>> {
        const queryParameters: any = {};

        if (requestParameters['locale'] != null) {
            queryParameters['locale'] = requestParameters['locale'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/genero`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(GeneroLiterarioFromJSON));
    }

    /**
     * Recupera una lista de géneros literarios en el idioma del locale proporcionado
     * Búsqueda de géneros literarios
     */
    async findGenerosLiterariosByLocale(requestParameters: FindGenerosLiterariosByLocaleRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<GeneroLiterario>> {
        const response = await this.findGenerosLiterariosByLocaleRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Recupera una lista de idiomas en el idioma del locale proporcionado
     * Búsqueda de idiomas
     */
    async findIdiomasByLocaleRaw(requestParameters: FindIdiomasByLocaleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<Idioma>>> {
        const queryParameters: any = {};

        if (requestParameters['locale'] != null) {
            queryParameters['locale'] = requestParameters['locale'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/idioma`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(IdiomaFromJSON));
    }

    /**
     * Recupera una lista de idiomas en el idioma del locale proporcionado
     * Búsqueda de idiomas
     */
    async findIdiomasByLocale(requestParameters: FindIdiomasByLocaleRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<Idioma>> {
        const response = await this.findIdiomasByLocaleRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Recupera una lista de libros en función de los criterios introducidos
     * Búsqueda de libros por criteria
     */
    async findLibrosByCriteriaRaw(requestParameters: FindLibrosByCriteriaRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<LibroDTO>>> {
        const queryParameters: any = {};

        if (requestParameters['id'] != null) {
            queryParameters['id'] = requestParameters['id'];
        }

        if (requestParameters['nombre'] != null) {
            queryParameters['nombre'] = requestParameters['nombre'];
        }

        if (requestParameters['isbn'] != null) {
            queryParameters['isbn'] = requestParameters['isbn'];
        }

        if (requestParameters['desdePrecio'] != null) {
            queryParameters['desdePrecio'] = requestParameters['desdePrecio'];
        }

        if (requestParameters['hastaPrecio'] != null) {
            queryParameters['hastaPrecio'] = requestParameters['hastaPrecio'];
        }

        if (requestParameters['desdeFecha'] != null) {
            queryParameters['desdeFecha'] = (requestParameters['desdeFecha'] as any).toISOString();
        }

        if (requestParameters['hastaFecha'] != null) {
            queryParameters['hastaFecha'] = (requestParameters['hastaFecha'] as any).toISOString();
        }

        if (requestParameters['generoLiterarioId'] != null) {
            queryParameters['generoLiterarioId'] = requestParameters['generoLiterarioId'];
        }

        if (requestParameters['clasificacionEdadId'] != null) {
            queryParameters['clasificacionEdadId'] = requestParameters['clasificacionEdadId'];
        }

        if (requestParameters['idiomaId'] != null) {
            queryParameters['idiomaId'] = requestParameters['idiomaId'];
        }

        if (requestParameters['formatoId'] != null) {
            queryParameters['formatoId'] = requestParameters['formatoId'];
        }

        if (requestParameters['locale'] != null) {
            queryParameters['locale'] = requestParameters['locale'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/libro`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(LibroDTOFromJSON));
    }

    /**
     * Recupera una lista de libros en función de los criterios introducidos
     * Búsqueda de libros por criteria
     */
    async findLibrosByCriteria(requestParameters: FindLibrosByCriteriaRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<LibroDTO>> {
        const response = await this.findLibrosByCriteriaRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Búsqueda de pedidos a partir de varios parámetros introducidos
     * Búsqueda de pedidos por criteria
     */
    async findPedidosByCriteriaRaw(requestParameters: FindPedidosByCriteriaRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<Pedido>>> {
        const queryParameters: any = {};

        if (requestParameters['id'] != null) {
            queryParameters['id'] = requestParameters['id'];
        }

        if (requestParameters['fechaDesde'] != null) {
            queryParameters['fechaDesde'] = requestParameters['fechaDesde'];
        }

        if (requestParameters['fechaHasta'] != null) {
            queryParameters['fechaHasta'] = requestParameters['fechaHasta'];
        }

        if (requestParameters['precioDesde'] != null) {
            queryParameters['precioDesde'] = requestParameters['precioDesde'];
        }

        if (requestParameters['precioHasta'] != null) {
            queryParameters['precioHasta'] = requestParameters['precioHasta'];
        }

        if (requestParameters['clienteId'] != null) {
            queryParameters['clienteId'] = requestParameters['clienteId'];
        }

        if (requestParameters['tipoEstadoPedidoId'] != null) {
            queryParameters['tipoEstadoPedidoId'] = requestParameters['tipoEstadoPedidoId'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/pedido`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(PedidoFromJSON));
    }

    /**
     * Búsqueda de pedidos a partir de varios parámetros introducidos
     * Búsqueda de pedidos por criteria
     */
    async findPedidosByCriteria(requestParameters: FindPedidosByCriteriaRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<Pedido>> {
        const response = await this.findPedidosByCriteriaRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async getExternalGrammarRaw(requestParameters: GetExternalGrammarRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['path'] == null) {
            throw new runtime.RequiredError(
                'path',
                'Required parameter "path" was null or undefined when calling getExternalGrammar().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/application.wadl/{path}`.replace(`{${"path"}}`, encodeURIComponent(String(requestParameters['path']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     */
    async getExternalGrammar(requestParameters: GetExternalGrammarRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.getExternalGrammarRaw(requestParameters, initOverrides);
    }

    /**
     */
    async getWadlRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/application.wadl`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     */
    async getWadl(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.getWadlRaw(initOverrides);
    }

    /**
     * Registro de un cliente introduciendo todos los datos del mismo
     * Registro de cliente
     */
    async registerClienteRaw(requestParameters: RegisterClienteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ClienteDTO>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/cliente/registrar`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ClienteDTOToJSON(requestParameters['clienteDTO']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ClienteDTOFromJSON(jsonValue));
    }

    /**
     * Registro de un cliente introduciendo todos los datos del mismo
     * Registro de cliente
     */
    async registerCliente(requestParameters: RegisterClienteRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ClienteDTO> {
        const response = await this.registerClienteRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
