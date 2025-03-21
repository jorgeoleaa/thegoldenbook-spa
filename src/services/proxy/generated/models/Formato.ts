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

import { mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface Formato
 */
export interface Formato {
    /**
     * 
     * @type {number}
     * @memberof Formato
     */
    id?: number;
    /**
     * 
     * @type {string}
     * @memberof Formato
     */
    nombre?: string;
}

/**
 * Check if a given object implements the Formato interface.
 */
export function instanceOfFormato(value: object): value is Formato {
    return true;
}

export function FormatoFromJSON(json: any): Formato {
    return FormatoFromJSONTyped(json, false);
}

export function FormatoFromJSONTyped(json: any, ignoreDiscriminator: boolean): Formato {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'] == null ? undefined : json['id'],
        'nombre': json['nombre'] == null ? undefined : json['nombre'],
    };
}

export function FormatoToJSON(json: any): Formato {
    return FormatoToJSONTyped(json, false);
}

export function FormatoToJSONTyped(value?: Formato | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'id': value['id'],
        'nombre': value['nombre'],
    };
}

