import AxiosClient from '../AxiosClient';

const folderRoute = '/v51/folder';
const fileRoute = '/v51/file';
const senderRoute = '/v51/sender';

export default {
    sendFile(file, xcsrfToken) {
        let formData = new FormData();
        formData.append('file', file);
        formData.append('encryptionpassword', 'test123');
        console.log(formData);
        return AxiosClient({
            method: 'post',
            url: `${senderRoute}`,
            data: formData,
            headers: {
                'X-CSRFToken': xcsrfToken,
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    getFolder(folderHash, xcsrfToken) {
        return AxiosClient({
            method: 'get',
            url: `${folderRoute}/${folderHash}`,
            headers: { 'X-CSRFToken': xcsrfToken }
        });
    },

    getFile(fileHash, userHash, xcsrfToken) {
        return AxiosClient({
            method: 'get',
            url: `${fileRoute}/${fileHash}?uh=${userHash}&streamedresponse=0`,
            headers: { 'X-CSRFToken': xcsrfToken, responseType: 'arraybuffer' }
        });
    },

    getFileLink(fileHash, xcsrfToken) {
        return AxiosClient({
            method: 'get',
            url: `${fileRoute}/${fileHash}`,
            headers: { 'X-CSRFToken': xcsrfToken }
        });
    },

    createFolder(label, xcsrfToken) {
        return AxiosClient({
            method: 'post',
            url: `${folderRoute}`,
            data: {
                label: label
            },
            headers: { 'X-CSRFToken': xcsrfToken }
        });
    },

    createSubFolder(label, parentFolder, xcsrfToken) {
        return AxiosClient({
            method: 'post',
            url: `${folderRoute}`,
            data: {
                label: label,
                parent_foh: parentFolder.parent_foh,
                parent_foid: parentFolder.parent_foid
            },
            headers: { 'X-CSRFToken': xcsrfToken }
        });
    },

    createFileInFolder(file, xcsrfToken) {
        let formData = new FormData();
        formData.append("q", file);

        return AxiosClient({
            method: 'post',
            url: `${fileRoute}?foid=b333b3917f41eacf7860def9e7d71140`,
            data: formData,
            headers: {
                'X-CSRFToken': xcsrfToken,
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    createFile(file, xcsrfToken) {
        let formData = new FormData();
        formData.append('file', file);
        formData.append('Content-Type', file.type);

        return AxiosClient({
            method: 'post',
            url: `${fileRoute}`,
            data: formData,
            headers: {
                'X-CSRFToken': xcsrfToken,
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    updateFile(file, fileHash, userHash, xcsrfToken) {
        let formData = new FormData();
        formData.append('fih', fileHash);
        formData.append('uh', userHash);
        formData.append('file', file);

        return AxiosClient({
            method: 'post',
            url: `${fileRoute}`,
            data: formData,
            headers: {
                'X-CSRFToken': xcsrfToken,
                'Content-Type': 'multipart/form-data'
            }
        });
    }
}