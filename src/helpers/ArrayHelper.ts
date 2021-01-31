
export class ArrayHelper {
    static getOne(array: any[], propertyName: string, value: any) {
        for (let i = 0; i < array.length; i++) if (array[i][propertyName] === value) return array[i];
        return null
    }

    static getAll(array: any[], propertyName: string, value: any) {
        var result: any[] = []
        for (let i = 0; i < array.length; i++) if (array[i][propertyName] === value) result.push(array[i]);
        return result;
    }

}
